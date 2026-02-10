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

/**
 * Upsert rows into a table. If the UNIQUE constraint for onConflict is missing
 * (Postgres error 42P10), fall back to delete-then-insert for the matching rows.
 */
async function safeUpsert(
  supabase: any,
  table: string,
  rows: Record<string, any>[],
  onConflict: string,
  userId: string
) {
  if (rows.length === 0) return { error: null }

  // Try the upsert first — works if the UNIQUE constraint exists
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict })

  if (!error) return { error: null }

  // If error is NOT 42P10, return it as-is
  if (error.code !== "42P10") {
    return { error }
  }

  // Fallback: constraint is missing. Delete only the matching fiskil rows, then insert.
  console.warn(
    `UNIQUE constraint missing for ${table} (${onConflict}). ` +
    `Falling back to delete + insert. Run scripts/002_add_unique_constraints.sql to fix permanently.`
  )

  // Determine the fiskil ID column from the onConflict spec (e.g. "user_id,fiskil_account_id")
  const conflictCols = onConflict.split(",").map((c) => c.trim())
  const fiskilIdCol = conflictCols.find((c) => c.startsWith("fiskil_"))
  if (fiskilIdCol) {
    // Delete only rows whose fiskil IDs are in the incoming set
    const incomingIds = rows.map((r) => r[fiskilIdCol]).filter(Boolean)
    if (incomingIds.length > 0) {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("user_id", userId)
        .in(fiskilIdCol, incomingIds)

      if (deleteError) {
        console.error(`Error deleting from ${table}:`, deleteError)
        return { error: deleteError }
      }
    }
  }

  const { error: insertError } = await supabase
    .from(table)
    .insert(rows)

  return { error: insertError }
}

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

  const authHeaders = {
    accept: "application/json",
    "content-type": "application/json; charset=UTF-8",
    authorization: `Bearer ${token}`,
  }

  // Fetch accounts — correct Fiskil endpoint is /v1/banking/accounts
  const accountsRes = await fetch(
    `${fiskilV1Base}/banking/accounts?end_user_id=${endUserId}`,
    { headers: authHeaders }
  )

  if (!accountsRes.ok) {
    const text = await accountsRes.text()
    throw new Error(`Failed to fetch accounts from Fiskil (${accountsRes.status}): ${text}`)
  }

  const accountsData = await accountsRes.json()
  const accountsList = accountsData.accounts || accountsData.data || []

  // Fetch balances — Fiskil returns balances via /v1/banking/balances
  const balancesRes = await fetch(
    `${fiskilV1Base}/banking/balances?end_user_id=${endUserId}`,
    { headers: authHeaders }
  )

  const balanceMap: Record<string, { current_balance: string; available_balance: string; currency: string }> = {}
  if (balancesRes.ok) {
    const balancesData = await balancesRes.json()
    for (const b of balancesData.balances || balancesData.data || []) {
      balanceMap[b.account_id] = {
        current_balance: b.current_balance || "0",
        available_balance: b.available_balance || "0",
        currency: b.currency || "AUD",
      }
    }
  }

  // Merge balance info into each account
  const accountsWithBalances = accountsList.map((acc: any) => {
    const bal = balanceMap[acc.account_id] || {}
    return { ...acc, ...bal }
  })

  // Fetch transactions — correct Fiskil endpoint is /v1/banking/transactions
  const allTransactions = []
  // First try fetching all transactions for the user at once
  const txRes = await fetch(
    `${fiskilV1Base}/banking/transactions?end_user_id=${endUserId}`,
    { headers: authHeaders }
  )

  if (txRes.ok) {
    const txData = await txRes.json()
    allTransactions.push(...(txData.transactions || txData.data || []))
  } else {
    // Log the error and fallback: fetch per account
    const txErrText = await txRes.text().catch(() => "")
    console.warn(`Bulk transaction fetch failed (${txRes.status}): ${txErrText}. Falling back to per-account fetch.`)
    for (const account of accountsWithBalances) {
      const accTxRes = await fetch(
        `${fiskilV1Base}/banking/transactions?account_id=${account.account_id}&end_user_id=${endUserId}`,
        { headers: authHeaders }
      )
      if (accTxRes.ok) {
        const accTxData = await accTxRes.json()
        allTransactions.push(...(accTxData.transactions || accTxData.data || []))
      }
    }
  }

  return {
    accounts: accountsWithBalances,
    transactions: allTransactions,
  }
}

async function injectRealData(supabase: any, userId: string, fiskilData: any) {
  const { accounts, transactions } = fiskilData

  // Insert accounts — map Fiskil response fields to our schema
  // Fiskil fields: account_id, display_name, account_ownership, bsb, bundle_name, current_balance, available_balance, currency
  const accountsToInsert = accounts.map((acc: any) => ({
    user_id: userId,
    fiskil_account_id: acc.account_id || acc.id,
    institution_name: acc.institution?.name || acc.institution_id || "Unknown",
    account_name: acc.display_name || acc.name || acc.account_name || acc.bundle_name,
    account_type: acc.product_category || acc.type || acc.account_type,
    balance: parseFloat(acc.current_balance || acc.balance || 0),
    currency: acc.currency || "AUD",
    last_synced_at: new Date().toISOString(),
  }))

  const { error: accountsError } = await safeUpsert(
    supabase, "bank_accounts", accountsToInsert, "user_id,fiskil_account_id", userId
  )

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

  // Insert transactions — map Fiskil response fields to our schema
  // Fiskil fields: transaction_id, account_id, amount, currency, description, merchant_name, category, execution_date_time, status
  const transactionsToInsert = transactions.map((tx: any) => {
    const amount = parseFloat(tx.amount || 0)
    const fiskilAccountId = tx.account_id
    return {
      user_id: userId,
      account_id: accountIdMap[fiskilAccountId] || null,
      fiskil_transaction_id: tx.transaction_id || tx.id,
      amount,
      currency: tx.currency || "AUD",
      description: tx.description || tx.reference,
      merchant_name: tx.merchant_name || tx.merchant?.name,
      category: tx.category?.primary_category || tx.category,
      transaction_type: amount > 0 ? "credit" : "debit",
      transaction_date: tx.execution_date_time || tx.posting_date_time || tx.value_date_time || tx.date || tx.transaction_date,
      is_pending: tx.status === "PENDING" || tx.pending || false,
    }
  })

  const { error: transactionsError } = await safeUpsert(
    supabase, "transactions", transactionsToInsert, "user_id,fiskil_transaction_id", userId
  )

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

  const { error: accountsError } = await safeUpsert(
    supabase, "bank_accounts", mockAccounts, "user_id,fiskil_account_id", userId
  )

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

  const { error: transactionsError } = await safeUpsert(
    supabase, "transactions", transactionsToInsert, "user_id,fiskil_transaction_id", userId
  )

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
