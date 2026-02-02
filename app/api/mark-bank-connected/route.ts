import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const FISKIL_BASE_URL = process.env.FISKIL_BASE_URL || "https://sandbox.fiskil.com.au/api"
const FISKIL_CLIENT_ID = process.env.FISKIL_CLIENT_ID
const FISKIL_CLIENT_SECRET = process.env.FISKIL_CLIENT_SECRET

async function getFiskilAccessToken(): Promise<string> {
  const response = await fetch(`${FISKIL_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: FISKIL_CLIENT_ID,
      client_secret: FISKIL_CLIENT_SECRET,
    }),
  })

  if (!response.ok) throw new Error("Failed to get Fiskil token")
  const data = await response.json()
  return data.access_token
}

async function fetchFiskilAccounts(accessToken: string, endUserId: string) {
  const response = await fetch(`${FISKIL_BASE_URL}/end-users/${endUserId}/accounts`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
  })

  if (!response.ok) return []
  const data = await response.json()
  return data.accounts || []
}

async function fetchFiskilTransactions(accessToken: string, accountId: string) {
  const response = await fetch(`${FISKIL_BASE_URL}/accounts/${accountId}/transactions`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
  })

  if (!response.ok) return []
  const data = await response.json()
  return data.transactions || []
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get profile with fiskil_user_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("fiskil_user_id")
      .eq("id", user.id)
      .single()

    if (!profile?.fiskil_user_id) {
      return NextResponse.json({ error: "No Fiskil user linked" }, { status: 400 })
    }

    // Update profile as connected
    await supabase
      .from("profiles")
      .update({ 
        has_bank_connection: true,
        is_onboarded: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)

    // Sync accounts and transactions from Fiskil
    if (FISKIL_CLIENT_ID && FISKIL_CLIENT_SECRET) {
      try {
        const accessToken = await getFiskilAccessToken()
        const accounts = await fetchFiskilAccounts(accessToken, profile.fiskil_user_id)

        for (const account of accounts) {
          // Upsert bank account
          const { data: bankAccount } = await supabase
            .from("bank_accounts")
            .upsert({
              user_id: user.id,
              fiskil_account_id: account.id,
              institution_name: account.institution?.name || "Unknown Bank",
              account_name: account.name || "Account",
              account_type: account.type || "checking",
              account_number_masked: account.masked_number,
              balance: account.balance?.current || 0,
              available_balance: account.balance?.available || 0,
              currency: account.currency || "AUD",
              last_synced_at: new Date().toISOString(),
            }, {
              onConflict: "fiskil_account_id"
            })
            .select()
            .single()

          if (bankAccount) {
            // Fetch and store transactions
            const transactions = await fetchFiskilTransactions(accessToken, account.id)

            for (const txn of transactions) {
              await supabase
                .from("transactions")
                .upsert({
                  user_id: user.id,
                  account_id: bankAccount.id,
                  fiskil_transaction_id: txn.id,
                  amount: txn.amount,
                  currency: txn.currency || "AUD",
                  description: txn.description,
                  merchant_name: txn.merchant?.name,
                  merchant_category: txn.merchant?.category,
                  category: txn.category,
                  transaction_type: txn.type,
                  transaction_date: txn.date,
                  posted_date: txn.posted_date,
                  is_pending: txn.pending || false,
                }, {
                  onConflict: "fiskil_transaction_id"
                })
            }
          }
        }
      } catch (syncError) {
        console.error("Error syncing Fiskil data:", syncError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bank connection complete and data synced",
    })
  } catch (error) {
    console.error("Error marking bank connected:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
