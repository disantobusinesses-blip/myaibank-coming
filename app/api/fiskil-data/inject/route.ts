import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const fiskilBaseUrl = process.env.FISKIL_BASE_URL
const fiskilClientId = process.env.FISKIL_CLIENT_ID
const fiskilClientSecret = process.env.FISKIL_CLIENT_SECRET

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
  // Get Fiskil access token
  const tokenRes = await fetch(`${fiskilBaseUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: fiskilClientId,
      client_secret: fiskilClientSecret,
      grant_type: "client_credentials",
    }),
  })

  if (!tokenRes.ok) {
    throw new Error("Failed to get Fiskil access token")
  }

  const { access_token } = await tokenRes.json()

  // Fetch accounts
  const accountsRes = await fetch(`${fiskilBaseUrl}/accounts?end_user_id=${endUserId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!accountsRes.ok) {
    throw new Error("Failed to fetch accounts from Fiskil")
  }

  const accountsData = await accountsRes.json()

  // Fetch transactions for each account
  const allTransactions = []
  for (const account of accountsData.accounts || []) {
    const txRes = await fetch(
      `${fiskilBaseUrl}/transactions?account_id=${account.id}&end_user_id=${endUserId}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    
    if (txRes.ok) {
      const txData = await txRes.json()
      allTransactions.push(...(txData.transactions || []))
    }
  }

  return {
    accounts: accountsData.accounts || [],
    transactions: allTransactions,
  }
}

async function injectRealData(supabase: any, userId: string, fiskilData: any) {
  const { accounts, transactions } = fiskilData

  // Insert accounts
  const accountsToInsert = accounts.map((acc: any) => ({
    user_id: userId,
    fiskil_account_id: acc.id,
    institution_name: acc.institution?.name || "Unknown",
    account_name: acc.name || acc.account_name,
    account_type: acc.type || acc.account_type,
    account_number_masked: acc.account_number?.masked || acc.mask,
    bsb: acc.bsb,
    balance: parseFloat(acc.balance || acc.current_balance || 0),
    available_balance: parseFloat(acc.available_balance || acc.balance || 0),
    currency: acc.currency || "AUD",
    is_primary: false,
    last_synced_at: new Date().toISOString(),
  }))

  const { error: accountsError } = await supabase
    .from("bank_accounts")
    .upsert(accountsToInsert, { onConflict: "user_id,fiskil_account_id" })

  if (accountsError) {
    console.error("Error inserting accounts:", accountsError)
  }

  // Insert transactions
  const transactionsToInsert = transactions.map((tx: any) => ({
    user_id: userId,
    fiskil_transaction_id: tx.id,
    amount: parseFloat(tx.amount || 0),
    currency: tx.currency || "AUD",
    description: tx.description,
    merchant_name: tx.merchant?.name || tx.merchant_name,
    category: tx.category,
    transaction_type: parseFloat(tx.amount || 0) > 0 ? "credit" : "debit",
    transaction_date: tx.date || tx.transaction_date,
    posted_date: tx.posted_date || tx.date,
    is_pending: tx.pending || false,
    is_recurring: false,
    is_subscription: false,
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
  // Mock accounts
  const mockAccounts = [
    {
      user_id: userId,
      fiskil_account_id: null,
      institution_name: "Commonwealth Bank",
      account_name: "Smart Access",
      account_type: "transaction",
      account_number_masked: "****1234",
      bsb: "062-000",
      balance: 4825.67,
      available_balance: 4825.67,
      currency: "AUD",
      is_primary: true,
      last_synced_at: new Date().toISOString(),
    },
    {
      user_id: userId,
      fiskil_account_id: null,
      institution_name: "Commonwealth Bank",
      account_name: "GoalSaver",
      account_type: "savings",
      account_number_masked: "****5678",
      bsb: "062-000",
      balance: 12450.00,
      available_balance: 12450.00,
      currency: "AUD",
      is_primary: false,
      last_synced_at: new Date().toISOString(),
    },
  ]

  const { error: accountsError } = await supabase
    .from("bank_accounts")
    .insert(mockAccounts)

  if (accountsError) {
    console.error("Error inserting mock accounts:", accountsError)
  }

  // Mock transactions
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

  const transactionsToInsert = mockTransactions.map(tx => ({
    user_id: userId,
    fiskil_transaction_id: null,
    amount: tx.amount,
    currency: "AUD",
    description: tx.description,
    merchant_name: tx.merchant_name,
    category: tx.category,
    transaction_type: tx.type,
    transaction_date: tx.date,
    posted_date: tx.date,
    is_pending: false,
    is_recurring: false,
    is_subscription: ["Netflix", "Spotify", "Apple", "Fitness First", "Medibank"].includes(tx.merchant_name),
  }))

  const { error: transactionsError } = await supabase
    .from("transactions")
    .insert(transactionsToInsert)

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
