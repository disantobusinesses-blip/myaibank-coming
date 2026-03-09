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

    // Ensure the profiles row exists for this user before inserting FK-dependent data.
    // The profile is normally created by a trigger on auth.users, but it may be missing
    // if the trigger was not set up, failed silently, or the user was created before the
    // trigger existed. This upsert is safe: it only inserts if the row is absent.
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: user_id },
        { onConflict: "id", ignoreDuplicates: true }
      )

    if (profileError) {
      console.error("Error ensuring profile exists:", profileError)
      return NextResponse.json(
        { error: `Profile creation failed: ${profileError.message}` },
        { status: 500 }
      )
    }

    // Check if Fiskil is configured — if not, return an error.
    // Never silently inject fabricated financial data for production users.
    if (!fiskilBaseUrl || !fiskilClientId || !fiskilClientSecret || !end_user_id) {
      console.warn("Fiskil not fully configured or no end_user_id provided")
      return NextResponse.json(
        {
          ok: false,
          error: "Fiskil integration not configured",
          message:
            "Set FISKIL_BASE_URL, FISKIL_CLIENT_ID, FISKIL_CLIENT_SECRET environment variables and provide end_user_id to enable bank data ingestion.",
        },
        { status: 503 }
      )
    }

    // Fetch real data from Fiskil
    try {
      const fiskilData = await fetchFiskilData(end_user_id)
      return await injectRealData(supabase, user_id, fiskilData)
    } catch (fiskilError) {
      console.error("Error fetching from Fiskil:", fiskilError)
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch bank data from Fiskil",
          message: fiskilError instanceof Error ? fiskilError.message : "Unknown error",
        },
        { status: 502 }
      )
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
