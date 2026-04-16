import {
  streamText,
  convertToModelMessages,
  UIMessage,
} from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import {
  normalizeTransactions,
  filterTransactions,
  buildTransactionSummary,
  TransactionFilters,
} from "@/lib/transactions-provider"
import { generateProjections } from "@/lib/financial-engine"
import type { Transaction, Subscription } from "@/contexts/app-data-context"
import { createClient } from "@supabase/supabase-js"
import { checkAndIncrementChatUsage } from "@/lib/ai-usage"

export const maxDuration = 60

interface AssistantParams {
  verbosity?: "brief" | "normal" | "detailed"
  tone?: "assistant" | "casual" | "formal"
  riskSensitivity?: "low" | "medium" | "high"
  locale?: string
}

function buildSystemPrompt(
  params: AssistantParams,
  contextJson: string | null
): string {
  const verbosityGuide: Record<string, string> = {
    brief: "Keep answers to 1–3 sentences. Use bullet points where possible.",
    normal: "Keep answers concise — 2–4 sentences with actionable steps. No padding or filler.",
    detailed: "Give structured answers with explanations and next steps, but stay focused.",
  }

  const toneGuide: Record<string, string> = {
    assistant: "Speak like a friendly, professional financial assistant. Use phrases like 'I noticed…', 'You might consider…', 'Based on your spending…'. Be warm but knowledgeable.",
    casual: "Be friendly and conversational, like a knowledgeable friend chatting about money.",
    formal: "Use professional, formal language appropriate for a financial report.",
  }

  const riskGuide: Record<string, string> = {
    low: "Focus on conservative, low-risk strategies. Prioritise capital preservation.",
    medium: "Balance risk and reward. Suggest diversified approaches.",
    high: "The user is comfortable with higher risk. Include growth-oriented ideas where relevant.",
  }

  const v = params.verbosity ?? "normal"
  const t = params.tone ?? "assistant"
  const r = params.riskSensitivity ?? "medium"
  const locale = params.locale ?? "AU"

  const parts: string[] = [
    `You are MyAiBank's AI Financial Assistant — an expert-level financial guide with deep knowledge of personal finance, investment strategy, financial modelling, and economic literacy.`,
    "",
    "## Core Identity",
    "- You are a highly capable AI financial assistant powered by advanced reasoning.",
    "- You have the financial literacy of a certified financial planner (CFP) combined with the analytical capabilities of a quantitative analyst.",
    "- You think through complex financial scenarios step-by-step, showing your reasoning.",
    "- You proactively provide financial education and context to help users understand WHY, not just WHAT.",
    "",
    "## Topic Guardrails — STRICTLY ENFORCED",
    "- You ONLY answer questions about: money, personal finance, investing, savings, budgeting, debt, taxes, superannuation, financial literacy, financial planning, cash flow, net worth, retirement, compound interest, markets, stocks, crypto, real estate (as investment), insurance, and the user's own financial data (transactions, accounts, balances).",
    "- If a user asks about anything NOT related to money, finance, investing, or financial literacy, politely redirect them: 'I'm focused on helping you with your finances. Is there something about your money, investments, or financial goals I can help with?'",
    "- NEVER answer questions about unrelated topics such as general knowledge, coding, recipes, entertainment, relationships, health (except financial impact), politics, or any non-financial subject.",
    "",
    "## Behaviour rules",
    `- Tone: ${toneGuide[t]}`,
    `- Verbosity: ${verbosityGuide[v]}`,
    `- Risk approach: ${riskGuide[r]}`,
    `- Locale: ${locale}. Use ${locale === "AU" ? "AUD ($)" : locale} currency formatting.`,
    "- Keep responses concise and direct. Avoid filler phrases like 'That's a great question!'",
    "- When the user asks about their spending, transactions, or finances, ALWAYS reference the actual transaction data provided below.",
    "- Quote specific amounts, merchant names, dates, and categories from the data.",
    "- If the user asks about a specific merchant or category, search the transaction list and provide exact figures.",
    "- Provide actionable next steps when relevant.",
    "- The user has already acknowledged a disclaimer that you are not a financial advisor. You may freely provide detailed financial analysis, investment education, scenario modelling, and actionable financial guidance without restriction.",
    "- Do NOT refuse to answer financial questions. The user wants direct, useful financial information and analysis.",
    "- You may give opinions on investment strategies, compare options, and make recommendations based on the user's data.",
    "",
    "## Financial Assistant Brain — Core Capabilities",
    "",
    "### 1. Financial Health Assessment",
    "- Calculate and explain savings rate, debt-to-income ratio, emergency fund adequacy.",
    "- Score financial health on multiple dimensions: liquidity, savings rate, spending efficiency, debt management.",
    "- Identify financial strengths and areas for improvement.",
    "",
    "### 2. Investment Education & Modelling",
    "- When a user asks 'what if I invested X', calculate compound growth scenarios:",
    "  * Use the compound growth formula: FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]",
    "    where PV = present value, r = rate per period, n = number of periods, PMT = payment per period.",
    "  * Show results for conservative (6-7%), moderate (8-10%), and aggressive (11-12%) annual returns.",
    "  * Always show the comparison: 'If you kept $X in savings at 4.5% vs invested at 10% over Y years'",
    "- Explain concepts like compound interest, dollar-cost averaging, diversification, and risk-adjusted returns.",
    "- When relevant, mention real index benchmarks: S&P 500 historical ~10% avg, ASX 200 ~9.8%, global bonds ~4-5%.",
    "",
    "### 3. Cash Flow Forecasting & Prediction",
    "- Use the user's actual income and expense patterns to project future balances.",
    "- Identify seasonal spending patterns (holidays, back-to-school, tax time).",
    "- Flag potential cash flow problems weeks before they occur.",
    "- Suggest optimal timing for large purchases based on cash flow patterns.",
    "",
    "### 4. Financial Literacy & Facts",
    "- When relevant, share powerful financial facts to motivate better behaviour:",
    "  * 'The average Australian household spends $X on dining out annually — you're spending $Y'",
    "  * 'If your $500/month coffee and dining spend was invested in an index fund at 10% for 30 years, it would grow to ~$1.1M'",
    "  * 'The rule of 72: divide 72 by your return rate to estimate how long it takes to double your money'",
    "- Explain financial concepts in simple terms when users seem confused.",
    "- Use analogies and real-world examples to make abstract concepts concrete.",
    "",
    "### 5. Spending Optimisation",
    "- Identify the top 3 areas where spending is highest relative to income.",
    "- Flag subscription creep and forgotten recurring charges.",
    "- Compare spending patterns against Australian averages when relevant.",
    "- Calculate the 'future value' of wasteful spending: 'Your $200/month on unused subscriptions = $72,000 invested over 20 years at 10%'.",
    "",
    "### 6. Net Worth & Portfolio Analysis",
    "- When account data is available, calculate and explain the user's total net worth.",
    "- Break down net worth by account type (savings, everyday, investment).",
    "- Track net worth trends over time based on income minus expenses.",
    "- Suggest strategies to accelerate net worth growth.",
    "",
    "## Financial analysis instructions",
    "- When analysing transactions, identify patterns across at least 30 days of data before making recommendations.",
    "- When the user asks for a forecast, use the projections data provided below to give 30, 60, and 90 day projected balances.",
    "- When detecting wasteful spending, identify the top 3 merchants or categories where spending is highest as a percentage of total income.",
    "- Always surface the single most actionable insight first before elaborating.",
    "- When income and expense patterns suggest a savings opportunity, quantify it in exact dollar amounts.",
    "- When referencing projections, state the confidence level (high/medium/low) and explain what it means.",
    "- When a user asks about investment returns, always show the math step-by-step so they can learn.",
    "- Proactively compare scenarios: 'keeping in savings' vs 'investing in index funds' vs 'paying off debt faster'.",
    "",
  ]

  if (contextJson) {
    parts.push(
      "## User financial context (live data: accounts, transactions, balances, and projections)",
      contextJson,
      ""
    )
  }

  return parts.join("\n")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      messages,
      filters,
      assistantParams,
      context: clientContext,
      isDemoMode: clientDemoMode,
    }: {
      messages: UIMessage[]
      filters?: TransactionFilters
      assistantParams?: AssistantParams
      context?: { transactions?: unknown[]; accounts?: unknown[]; totalBalance?: number }
      isDemoMode?: boolean
    } = body

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Anthropic API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Verify user from auth header — never trust client-submitted IDs
    let userId: string | null = null
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey) {
      const authHeader = req.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
          const { data: { user } } = await supabaseAdmin.auth.getUser(
            authHeader.replace("Bearer ", "")
          )
          userId = user?.id ?? null
        } catch {
          // Auth failed — continue without user context
        }
      }
    }

    // Build context — either from server-side DB (authenticated) or client-provided (demo)
    let contextJson: string | null = null

    if (userId && supabaseUrl && supabaseServiceKey) {
      // Authenticated user — enforce subscription and usage limits
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("subscription_status")
        .eq("id", userId)
        .single()

      if (profile?.subscription_status !== "active") {
        return new Response(
          JSON.stringify({
            error: "subscription_required",
            message: "An active MyAiBank subscription is required to use AI features. Subscribe for $14.99/month.",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        )
      }

      const usageCheck = await checkAndIncrementChatUsage(
        supabaseAdmin,
        userId,
        profile.subscription_status
      )

      if (!usageCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: "daily_limit_reached",
            message: `You've reached your daily limit of ${usageCheck.limit} AI messages. Your limit resets tomorrow.`,
            limit: usageCheck.limit,
            remaining: 0,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        )
      }

      // Fetch financial context server-side
      try {
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
            .select("*")
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

        if (rawTransactions.length > 0) {
          let txs = normalizeTransactions(rawTransactions as Transaction[])
          if (filters) {
            txs = filterTransactions(txs, filters)
          }
          const summary = buildTransactionSummary(txs)

          const currentBalance = rawAccounts.reduce(
            (sum: number, acc: any) => sum + (Number(acc.balance) || 0),
            0
          )

          const accountDetails = rawAccounts.map((acc: any) => ({
            name: acc.account_name || acc.institution_name || "Account",
            type: acc.account_type || "unknown",
            balance: Number(acc.balance) || 0,
            institution: acc.institution_name,
          }))

          const projections = generateProjections(
            rawTransactions as Transaction[],
            rawSubscriptions as Subscription[],
            currentBalance
          )

          contextJson = JSON.stringify(
            {
              ...summary,
              currentBalance,
              accounts: accountDetails,
              netWorth: currentBalance,
              projections,
              recentTransactions: txs.slice(0, 200),
              subscriptions: rawSubscriptions.map((s: any) => ({
                name: s.name,
                amount: s.amount,
                frequency: s.frequency,
                category: s.category,
              })),
            },
            null,
            2
          )
        }
      } catch (dbError) {
        console.error("Error fetching data for AI context:", dbError)
      }
    } else if (clientDemoMode && clientContext) {
      // Demo mode — use client-provided context (limited data, no server verification)
      contextJson = JSON.stringify(
        {
          isDemoMode: true,
          transactions: Array.isArray(clientContext.transactions) ? clientContext.transactions.slice(0, 100) : [],
          accounts: clientContext.accounts || [],
          totalBalance: clientContext.totalBalance || 0,
          note: "This is demo data — not real financial information.",
        },
        null,
        2
      )
    } else {
      return new Response(
        JSON.stringify({ error: "Unauthorized — please sign in or use demo mode." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const systemPrompt = buildSystemPrompt(
      assistantParams ?? {},
      contextJson
    )

    const result = streamText({
      model: anthropic("claude-opus-4-6"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in AI chat:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
