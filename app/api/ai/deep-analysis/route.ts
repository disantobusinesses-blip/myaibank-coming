import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { createClient } from "@supabase/supabase-js"
import { checkAndIncrementDeepAnalysis } from "@/lib/ai-usage"
import { normalizeTransactions, buildTransactionSummary } from "@/lib/transactions-provider"
import { generateProjections } from "@/lib/financial-engine"
import type { Transaction, Subscription } from "@/contexts/app-data-context"

export const maxDuration = 60

const DEEP_ANALYSIS_PROMPT = `You are MyAiBank's Senior AI Financial Analyst.
You are performing a DEEP MONTHLY FINANCIAL ANALYSIS. Be comprehensive and specific.
Use exact dollar amounts from the data provided. Never use placeholders like "$X".

Structure your response with these exact sections:

## 1. FINANCIAL HEALTH SCORE
Overall score out of 100 with explanation.
Sub-scores:
- Income stability (out of 25): score and reason
- Spending discipline (out of 25): score and reason
- Savings rate (out of 25): score and reason
- Financial trajectory (out of 25): score and reason

## 2. INCOME & EXPENSE BREAKDOWN
- Total income this month: exact amount
- Total expenses this month: exact amount
- Net position: surplus or deficit with exact amount
- Top 5 spending categories with exact amounts and % of total income

## 3. GOAL PROJECTIONS
Based on current savings rate:
- Projected savings in 3 months
- Projected savings in 6 months
- Projected savings in 12 months
- Estimated time to reach $10,000 emergency fund
- Estimated time to reach $50,000 savings milestone

## 4. WASTEFUL SPENDING
Top 3 areas of wasteful or reducible spending.
For each: name it, exact monthly cost, specific action to reduce it, estimated saving.

## 5. SUBSCRIPTION AUDIT
All detected recurring payments listed with amounts.
Flag any unused, duplicated, or overpriced subscriptions.
Total monthly subscription cost.

## 6. TOP 3 ACTIONS
Three specific actions ranked by financial impact.
For each: what to do, why, estimated monthly benefit in dollars.

## 7. 90-DAY CASH FLOW FORECAST
- 30-day projected balance
- 60-day projected balance
- 90-day projected balance
- Key assumptions and confidence level

⚠️ This is general financial information only — not personal financial advice. Please consult a qualified financial adviser before making major financial decisions.`

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!process.env.ANTHROPIC_API_KEY || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user
    let userId: string | null = null
    const authHeader = req.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(
        authHeader.replace("Bearer ", "")
      )
      userId = user?.id ?? null
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    // Check subscription
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .single()

    if (profile?.subscription_status !== "active") {
      return new Response(
        JSON.stringify({
          error: "subscription_required",
          message: "An active MyAiBank subscription is required. Subscribe for $14.99/month.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      )
    }

    // Check deep analysis monthly limit
    const usageCheck = await checkAndIncrementDeepAnalysis(
      supabaseAdmin,
      userId,
      profile.subscription_status
    )

    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: "monthly_limit_reached",
          message: `You've used your 1 deep analysis for this month. Resets on the 1st of next month.`,
          remaining: 0,
          limit: usageCheck.limit,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      )
    }

    // Fetch financial data
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const [txResult, accountsResult, subsResult] = await Promise.all([
      supabaseAdmin
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .gte("transaction_date", ninetyDaysAgo.toISOString().split("T")[0])
        .order("transaction_date", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("bank_accounts")
        .select("balance")
        .eq("user_id", userId),
      supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true),
    ])

    const rawTransactions = txResult.data ?? []
    const rawAccounts = accountsResult.data ?? []
    const rawSubscriptions = subsResult.data ?? []

    const txs = normalizeTransactions(rawTransactions as Transaction[])
    const summary = buildTransactionSummary(txs)
    const currentBalance = rawAccounts.reduce(
      (sum: number, acc: { balance?: unknown }) => sum + (Number(acc.balance) || 0), 0
    )
    const projections = generateProjections(
      rawTransactions as Transaction[],
      rawSubscriptions as Subscription[],
      currentBalance
    )

    const contextJson = JSON.stringify({
      ...summary,
      currentBalance,
      projections,
      subscriptions: rawSubscriptions,
      recentTransactions: txs.slice(0, 300),
    }, null, 2)

    // Run with Opus 4.6
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const { text } = await generateText({
      model: anthropic("claude-opus-4-6"),
      system: DEEP_ANALYSIS_PROMPT,
      messages: [{
        role: "user",
        content: `Perform my complete monthly deep financial analysis using this data:\n\n${contextJson}`,
      }],
      maxOutputTokens: 4000,
    })

    return new Response(
      JSON.stringify({
        analysis: text,
        remaining: usageCheck.remaining,
        generatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Deep analysis error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to generate analysis" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
