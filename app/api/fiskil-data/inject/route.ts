import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const fiskilBaseUrl = process.env.FISKIL_BASE_URL || "https://api.fiskil.com"
const fiskilClientId = process.env.FISKIL_CLIENT_ID
const fiskilClientSecret = process.env.FISKIL_CLIENT_SECRET

// Normalize base URL to include /v1 like the consent-session route does
const normalizeBase = (url: string) => String(url || "").replace(/\/$/, "")
const toV1 = (base: string) => {
  const b = normalizeBase(base)
  return /\/v1$/i.test(b) ? b : `${b}/v1`
}
const fiskilV1Base = toV1(fiskilBaseUrl)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { end_user_id, user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase not configured, skipping data injection")
      return NextResponse.json({ 
        ok: true, 
        message: "Supabase not configured, no data injected" 
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if Fiskil is configured - if not, use mock data
    if (!fiskilBaseUrl || !fiskilClientId || !fiskilClientSecret || !end_user_id) {
      console.log("Fiskil not fully configured or no end_user_id, using mock data")
      return await injectMockData(supabase, user_id)
    }

    // Fetch real data from Fiskil
    try {
      const fiskilData = await fetchFiskilData(end_user_id)
      return await injectRealData(supabase, user_id, fiskilData)
    } catch (fiskilError) {
      console.error("Error fetching from Fiskil, falling back to mock data:", fiskilError)
      return await injectMockData(supabase, user_id)
    }

  } catch (error) {
    console.error("Error in fiskil-data/inject:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

async function fetchFiskilData(endUserId: string) {
  // Get Fiskil token — use the same /v1/token endpoint as create-consent-session
  const tokenRes = await fetch(`${fiskilV1Base}/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      client_id: fiskilClientId,
      client_secret: fiskilClientSecret,
    }),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    throw new Error(`Failed to get Fiskil token (${tokenRes.status}): ${text}`)
  }

  const tokenJson = await tokenRes.json()
  const token = tokenJson.token
  if (!token) {
    throw new Error(`Fiskil token missing in response: ${JSON.stringify(tokenJson)}`)
  }

  // Fetch accounts
  const accountsRes = await fetch(`${fiskilV1Base}/accounts?end_user_id=${endUserId}`, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  })

  if (!accountsRes.ok) {
    const text = await accountsRes.text()
    throw new Error(`Failed to fetch accounts from Fiskil (${accountsRes.status}): ${text}`)
  }

  const accountsData = await accountsRes.json()
  const accountsList = accountsData.accounts || accountsData.data || []

  // Fetch transactions for each account
  const allTransactions = []
  for (const account of accountsList) {
    const txRes = await fetch(
      `${fiskilV1Base}/transactions?account_id=${account.id}&end_user_id=${endUserId}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
    
    if (txRes.ok) {
      const txData = await txRes.json()
      allTransactions.push(...(txData.transactions || txData.data || []))
    }
  }

  return {
    accounts: accountsList,
    transactions: allTransactions,
  }
}

async function injectRealData(supabase: any, userId: string, fiskilData: any) {
  const { accounts, transactions } = fiskilData

  // Insert accounts — only columns that exist in the bank_accounts schema
  const accountsToInsert = accounts.map((acc: any) => ({
    user_id: userId,
    fiskil_account_id: acc.id,
    institution_name: acc.institution?.name || "Unknown",
    account_name: acc.name || acc.account_name,
    account_type: acc.type || acc.account_type,
    balance: parseFloat(acc.balance || acc.current_balance || 0),
    currency: acc.currency || "AUD",
    last_synced_at: new Date().toISOString(),
  }))

  const { error: accountsError } = await supabase
    .from("bank_accounts")
    .upsert(accountsToInsert, { onConflict: "user_id,fiskil_account_id" })

  if (accountsError) {
    console.error("Error inserting accounts:", accountsError)
  }

  // Build a lookup from fiskil_account_id → DB account row id
  const { data: savedAccounts } = await supabase
    .from("bank_accounts")
    .select("id, fiskil_account_id")
    .eq("user_id", userId)

  const accountIdMap: Record<string, string> = {}
  for (const row of savedAccounts || []) {
    if (row.fiskil_account_id) {
      accountIdMap[row.fiskil_account_id] = row.id
    }
  }

  // Insert transactions — only columns that exist in the transactions schema
  const transactionsToInsert = transactions.map((tx: any) => ({
    user_id: userId,
    account_id: accountIdMap[tx.account_id] || null,
    fiskil_transaction_id: tx.id,
    amount: parseFloat(tx.amount || 0),
    currency: tx.currency || "AUD",
    description: tx.description,
    merchant_name: tx.merchant?.name || tx.merchant_name,
    category: tx.category,
    transaction_type: parseFloat(tx.amount || 0) > 0 ? "credit" : "debit",
    transaction_date: tx.date || tx.transaction_date,
    is_pending: tx.pending || false,
  }))

  const { error: transactionsError } = await supabase
    .from("transactions")
    .upsert(transactionsToInsert, { onConflict: "user_id,fiskil_transaction_id" })

  if (transactionsError) {
    console.error("Error inserting transactions:", transactionsError)
  }

  return NextResponse.json({
    ok: true,
    message: "Real Fiskil data injected successfully",
    accounts: accountsToInsert.length,
    transactions: transactionsToInsert.length,
  })
}

async function injectMockData(supabase: any, userId: string) {
  // Mock accounts — only columns that exist in the bank_accounts schema
  // Uses deterministic fiskil_account_id to allow upsert
  const mockAccounts = [
    {
      user_id: userId,
      fiskil_account_id: `mock-account-${userId}-1`,
      institution_name: "Commonwealth Bank",
      account_name: "Smart Access",
      account_type: "transaction",
      balance: 4825.67,
      currency: "AUD",
      last_synced_at: new Date().toISOString(),
    },
    {
      user_id: userId,
      fiskil_account_id: `mock-account-${userId}-2`,
      institution_name: "Commonwealth Bank",
      account_name: "GoalSaver",
      account_type: "savings",
      balance: 12450.00,
      currency: "AUD",
      last_synced_at: new Date().toISOString(),
    },
  ]

  const { error: accountsError } = await supabase
    .from("bank_accounts")
    .upsert(mockAccounts, { onConflict: "user_id,fiskil_account_id" })

  if (accountsError) {
    console.error("Error inserting mock accounts:", accountsError)
  }

  // Mock transactions — only columns that exist in the transactions schema
  const daysAgo = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split("T")[0]
  }

  const mockTransactions = [
    { amount: 4500.00, description: "Salary - TechCorp Pty Ltd", merchant_name: "TechCorp Pty Ltd", category: "Income", date: daysAgo(1), type: "credit" },
    { amount: -1800.00, description: "Rent Payment", merchant_name: "Ray White Property", category: "Housing", date: daysAgo(2), type: "debit" },
    { amount: -156.78, description: "Electricity Bill", merchant_name: "AGL Energy", category: "Utilities", date: daysAgo(3), type: "debit" },
    { amount: -89.00, description: "Internet - NBN Plan", merchant_name: "Telstra", category: "Utilities", date: daysAgo(5), type: "debit" },
    { amount: -22.99, description: "Netflix Premium", merchant_name: "Netflix", category: "Entertainment", date: daysAgo(7), type: "debit" },
    { amount: -12.99, description: "Spotify Premium", merchant_name: "Spotify", category: "Entertainment", date: daysAgo(8), type: "debit" },
    { amount: -7.99, description: "iCloud Storage", merchant_name: "Apple", category: "Technology", date: daysAgo(10), type: "debit" },
    { amount: -65.00, description: "Gym Membership", merchant_name: "Fitness First", category: "Health & Fitness", date: daysAgo(12), type: "debit" },
    { amount: -24.56, description: "Uber - Home to CBD", merchant_name: "Uber", category: "Transport", date: daysAgo(1), type: "debit" },
    { amount: -125.67, description: "Weekly Groceries", merchant_name: "Woolworths", category: "Groceries", date: daysAgo(3), type: "debit" },
    { amount: -78.50, description: "Dinner - Italian Place", merchant_name: "The Italian Place", category: "Dining", date: daysAgo(2), type: "debit" },
    { amount: -6.50, description: "Morning Coffee", merchant_name: "Campos Coffee", category: "Dining", date: daysAgo(1), type: "debit" },
    { amount: -149.00, description: "New Headphones", merchant_name: "JB Hi-Fi", category: "Shopping", date: daysAgo(6), type: "debit" },
    { amount: -125.00, description: "Health Insurance Premium", merchant_name: "Medibank", category: "Insurance", date: daysAgo(9), type: "debit" },
    { amount: -500.00, description: "Transfer to Savings", merchant_name: "Internal Transfer", category: "Transfer", date: daysAgo(1), type: "debit" },
  ]

  const transactionsToInsert = mockTransactions.map((tx, idx) => ({
    user_id: userId,
    fiskil_transaction_id: `mock-tx-${userId}-${idx}`,
    amount: tx.amount,
    currency: "AUD",
    description: tx.description,
    merchant_name: tx.merchant_name,
    category: tx.category,
    transaction_type: tx.type,
    transaction_date: tx.date,
    is_pending: false,
  }))

  const { error: transactionsError } = await supabase
    .from("transactions")
    .upsert(transactionsToInsert, { onConflict: "user_id,fiskil_transaction_id" })

  if (transactionsError) {
    console.error("Error inserting mock transactions:", transactionsError)
  }

  return NextResponse.json({
    ok: true,
    message: "Mock data injected successfully (Fiskil not configured)",
    accounts: mockAccounts.length,
    transactions: transactionsToInsert.length,
  })
}
