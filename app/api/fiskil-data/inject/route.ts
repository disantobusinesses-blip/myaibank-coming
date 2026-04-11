import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const fiskilBaseUrl = process.env.FISKIL_BASE_URL || "https://api.fiskil.com"
const fiskilClientId = process.env.FISKIL_CLIENT_ID
const fiskilClientSecret = process.env.FISKIL_CLIENT_SECRET

const normalizeBase = (url: string) => String(url || "").replace(/\/$/, "")
const toV1 = (base: string) => {
  const b = normalizeBase(base)
  return /\/v1$/i.test(b) ? b : `${b}/v1`
}
const fiskilV1Base = toV1(fiskilBaseUrl)

// In-memory token cache — avoids a round trip on every inject call
let cachedToken: string | null = null
let tokenExpiresAt = 0

function extractFiskilCategory(tx: any): string | null {
  if (!tx.category) return null
  if (typeof tx.category === "string") return tx.category
  if (typeof tx.category === "object") {
    return (
      tx.category.primary_category ||
      tx.category.primaryCategory ||
      tx.category.name ||
      tx.category.label ||
      null
    )
  }
  return null
}

async function safeUpsert(
  supabase: any,
  table: string,
  rows: Record<string, any>[],
  onConflict: string,
  userId: string
) {
  if (rows.length === 0) return { error: null }
  const { error } = await supabase.from(table).upsert(rows, { onConflict })
  if (!error) return { error: null }
  if (error.code !== "42P10") return { error }

  console.warn(
    `UNIQUE constraint missing for ${table} (${onConflict}). ` +
      `Falling back to delete + insert. Run scripts/002_add_unique_constraints.sql to fix permanently.`
  )

  const conflictCols = onConflict.split(",").map((c) => c.trim())
  const fiskilIdCol = conflictCols.find((c) => c.startsWith("fiskil_"))
  if (fiskilIdCol) {
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
  const { error: insertError } = await supabase.from(table).insert(rows)
  return { error: insertError }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Only accept verified auth header — never trust body user_id
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ") || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let verifiedUserId: string | null = null
    try {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey)
      const {
        data: { user },
      } = await adminClient.auth.getUser(authHeader.replace("Bearer ", ""))
      verifiedUserId = user?.id ?? null
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (!verifiedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { end_user_id } = body

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Ensure profile row exists
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: verifiedUserId }, { onConflict: "id", ignoreDuplicates: true })

    if (profileError) {
      console.error("Error ensuring profile exists:", profileError)
      return NextResponse.json(
        { error: `Profile creation failed: ${profileError.message}` },
        { status: 500 }
      )
    }

    if (!fiskilBaseUrl || !fiskilClientId || !fiskilClientSecret || !end_user_id) {
      console.warn("Fiskil not fully configured or no end_user_id provided")
      return NextResponse.json(
        {
          ok: false,
          error: "Fiskil integration not configured",
          message: "Set FISKIL_BASE_URL, FISKIL_CLIENT_ID, FISKIL_CLIENT_SECRET and provide end_user_id.",
        },
        { status: 503 }
      )
    }

    try {
      const fiskilData = await fetchFiskilData(end_user_id)
      return await injectRealData(supabase, verifiedUserId, fiskilData)
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

async function getFiskilToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken

  const delays = [0, 1000, 2000]
  let lastError = ""
  for (const delay of delays) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay))
    try {
      const res = await fetch(`${fiskilV1Base}/token`, {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ client_id: fiskilClientId, client_secret: fiskilClientSecret }),
      })
      if (!res.ok) { lastError = await res.text(); continue }
      const json = await res.json()
      const token = json.token
      if (!token) throw new Error(`Fiskil token missing: ${JSON.stringify(json)}`)
      cachedToken = token
      tokenExpiresAt = Date.now() + 55 * 60 * 1000
      return token
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error"
    }
  }
  throw new Error(`Failed to get Fiskil token after 3 attempts: ${lastError}`)
}

async function fetchAllPages(
  initialUrl: string,
  headers: Record<string, string>,
  dataKey: string
): Promise<any[]> {
  const all: any[] = []
  let nextUrl: string | null = initialUrl
  while (nextUrl) {
    const res = await fetch(nextUrl, { headers })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Fiskil paginated fetch failed (${res.status}): ${text}`)
    }
    const data = await res.json()
    all.push(...(data[dataKey] || data.data || []))
    nextUrl = data.links?.next || null
  }
  return all
}

async function fetchFiskilData(endUserId: string) {
  const token = await getFiskilToken()
  const authHeaders: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json; charset=UTF-8",
    authorization: `Bearer ${token}`,
  }

  const accountsList = await fetchAllPages(
    `${fiskilV1Base}/banking/accounts?end_user_id=${endUserId}`,
    authHeaders,
    "accounts"
  )

  const balanceMap: Record<string, { current_balance: string; available_balance: string; currency: string }> = {}
  try {
    const balances = await fetchAllPages(
      `${fiskilV1Base}/banking/balances?end_user_id=${endUserId}`,
      authHeaders,
      "balances"
    )
    for (const b of balances) {
      balanceMap[b.account_id] = {
        current_balance: b.current_balance || "0",
        available_balance: b.available_balance || "0",
        currency: b.currency || "AUD",
      }
    }
  } catch (err) {
    console.warn("Failed to fetch balances, continuing without:", err)
  }

  const accountsWithBalances = accountsList.map((acc: any) => ({
    ...acc,
    ...(balanceMap[acc.account_id] || {}),
  }))

  let allTransactions: any[] = []
  try {
    allTransactions = await fetchAllPages(
      `${fiskilV1Base}/banking/transactions?end_user_id=${endUserId}`,
      authHeaders,
      "transactions"
    )
  } catch (err) {
    console.warn(`Bulk transaction fetch failed: ${err}. Falling back to per-account fetch.`)
    for (const account of accountsWithBalances) {
      try {
        const txs = await fetchAllPages(
          `${fiskilV1Base}/banking/transactions?account_id=${account.account_id}&end_user_id=${endUserId}`,
          authHeaders,
          "transactions"
        )
        allTransactions.push(...txs)
      } catch (accErr) {
        console.warn(`Failed to fetch transactions for account ${account.account_id}:`, accErr)
      }
    }
  }

  let scheduledPayments: any[] = []
  try {
    scheduledPayments = await fetchAllPages(
      `${fiskilV1Base}/banking/scheduled-payments?end_user_id=${endUserId}`,
      authHeaders,
      "scheduled_payments"
    )
  } catch (err) {
    console.warn("Failed to fetch scheduled payments, continuing without:", err)
  }

  return { accounts: accountsWithBalances, transactions: allTransactions, scheduledPayments }
}

async function injectRealData(supabase: any, userId: string, fiskilData: any) {
  const { accounts, transactions, scheduledPayments } = fiskilData

  const accountsToInsert = accounts.map((acc: any) => ({
    user_id: userId,
    fiskil_account_id: acc.account_id || acc.id,
    institution_name: acc.institution?.name || acc.institution_id || "Unknown",
    account_name: acc.display_name || acc.name || acc.account_name || acc.bundle_name,
    account_type: acc.product_category || acc.type || acc.account_type,
    balance: parseFloat(acc.current_balance || acc.balance || 0),
    available_balance: parseFloat(acc.available_balance || acc.current_balance || acc.balance || 0),
    currency: acc.currency || "AUD",
    last_synced_at: new Date().toISOString(),
  }))

  const { error: accountsError } = await safeUpsert(
    supabase, "bank_accounts", accountsToInsert, "user_id,fiskil_account_id", userId
  )
  if (accountsError) console.error("Error inserting accounts:", accountsError)

  const { data: savedAccounts } = await supabase
    .from("bank_accounts")
    .select("id, fiskil_account_id")
    .eq("user_id", userId)

  const accountIdMap: Record<string, string> = {}
  for (const row of savedAccounts || []) {
    if (row.fiskil_account_id) accountIdMap[row.fiskil_account_id] = row.id
  }

  const transactionsToInsert = transactions.map((tx: any) => {
    const amount = parseFloat(tx.amount || 0)
    return {
      user_id: userId,
      account_id: accountIdMap[tx.account_id] || null,
      fiskil_transaction_id: tx.transaction_id || tx.id,
      amount,
      currency: tx.currency || "AUD",
      description: tx.description || tx.reference,
      merchant_name: tx.merchant_name || tx.merchant?.name,
      category: extractFiskilCategory(tx),
      transaction_type: amount > 0 ? "credit" : "debit",
      transaction_date:
        tx.execution_date_time ||
        tx.posting_date_time ||
        tx.value_date_time ||
        tx.date ||
        tx.transaction_date,
      is_pending: tx.status === "PENDING" || tx.pending || false,
    }
  })

  const { error: transactionsError } = await safeUpsert(
    supabase, "transactions", transactionsToInsert, "user_id,fiskil_transaction_id", userId
  )
  if (transactionsError) console.error("Error inserting transactions:", transactionsError)

  if (scheduledPayments.length > 0) {
    const scheduledToInsert = scheduledPayments.map((sp: any) => ({
      user_id: userId,
      fiskil_payment_id: sp.scheduled_payment_id || sp.id,
      account_id: accountIdMap[sp.account_id] || null,
      nickname: sp.nickname || sp.description,
      amount: parseFloat(sp.amount?.amount || sp.amount || 0),
      currency: sp.amount?.currency || sp.currency || "AUD",
      next_payment_date: sp.next_payment_date || sp.next_date,
      payment_frequency: sp.recurrence?.interval_period || sp.frequency || null,
      is_active: true,
    }))
    try {
      await safeUpsert(supabase, "scheduled_payments", scheduledToInsert, "user_id,fiskil_payment_id", userId)
    } catch (spErr) {
      console.warn("scheduled_payments table may not exist yet — skipping:", spErr)
    }
  }

  try {
    const { data: uncategorized } = await supabase
      .from("transactions")
      .select("id, merchant_name, description, category")
      .eq("user_id", userId)
      .or("category.is.null,category.eq.uncategorized")
      .limit(100)

    if (uncategorized && uncategorized.length > 0) {
      const { categoriseTransactions } = await import("@/lib/categorisation")
      const enriched = categoriseTransactions(uncategorized)
      for (const tx of enriched) {
        if (tx._categorised.confidence > 0.5) {
          await supabase
            .from("transactions")
            .update({
              ai_category: tx._categorised.category,
              ai_merchant_clean: tx._categorised.merchant,
              categorisation_confidence: tx._categorised.confidence,
            })
            .eq("id", (tx as any).id)
        }
      }
    }
  } catch (enrichErr) {
    console.error("Non-fatal: AI categorisation enrichment failed:", enrichErr)
  }

  return NextResponse.json({
    ok: true,
    message: "Fiskil data injected successfully",
    accounts: accountsToInsert.length,
    transactions: transactionsToInsert.length,
    scheduledPayments: scheduledPayments.length,
  })
}
