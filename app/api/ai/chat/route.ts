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

export const maxDuration = 30

interface AssistantParams {
  verbosity?: "brief" | "normal" | "detailed"
  tone?: "advisor" | "casual" | "formal"
  riskSensitivity?: "low" | "medium" | "high"
  locale?: string
}

const DISCLAIMER =
  "⚠️ *This is general financial information only — not personal financial advice. " +
  "I am an AI assistant, not a licensed financial adviser. " +
  "Please consult a qualified professional before making important financial decisions.*"

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
    advisor: "Speak like a friendly, professional financial advisor. Use phrases like 'I noticed…', 'You might consider…', 'Based on your spending…'. Be warm but knowledgeable.",
    casual: "Be friendly and conversational, like a knowledgeable friend chatting about money.",
    formal: "Use professional, formal language appropriate for a financial report.",
  }

  const riskGuide: Record<string, string> = {
    low: "Focus on conservative, low-risk strategies. Prioritise capital preservation.",
    medium: "Balance risk and reward. Suggest diversified approaches.",
    high: "The user is comfortable with higher risk. Include growth-oriented ideas where relevant.",
  }

  const v = params.verbosity ?? "normal"
  const t = params.tone ?? "advisor"
  const r = params.riskSensitivity ?? "medium"
  const locale = params.locale ?? "AU"

  const parts: string[] = [
    `You are MyAiBank's AI Financial Assistant — a knowledgeable, ${t === "advisor" ? "friendly professional" : t} guide who helps users understand their money.`,
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
    "- NEVER claim to be a licensed financial adviser or provide specific investment, tax, or legal advice.",
    "- If the user asks for specific investment or tax advice, politely decline and recommend consulting a qualified professional.",
    "",
    "## Financial analysis instructions",
    "- When analysing transactions, identify patterns across at least 30 days of data before making recommendations.",
    "- When the user asks for a forecast, use the projections data provided below to give 30, 60, and 90 day projected balances.",
    "- When detecting wasteful spending, identify the top 3 merchants or categories where spending is highest as a percentage of total income.",
    "- Always surface the single most actionable insight first before elaborating.",
    "- When income and expense patterns suggest a savings opportunity, quantify it in exact dollar amounts.",
    "- When referencing projections, state the confidence level (high/medium/low) and explain what it means.",
    `- Always end responses containing financial analysis or recommendations with: ${DISCLAIMER}`,
    "",
  ]

  if (contextJson) {
    parts.push(
      "## User financial context (live transaction data, aggregates, and projections)",
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
    }: {
      messages: UIMessage[]
      filters?: TransactionFilters
      assistantParams?: AssistantParams
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

    // Fetch transactions, accounts, and subscriptions server-side
    let contextJson: string | null = null

    if (userId && supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

        const [txResult, accountsResult, subsResult] = await Promise.all([
          supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .gte("transaction_date", ninetyDaysAgo.toISOString().split("T")[0])
            .order("transaction_date", { ascending: false })
            .limit(500),
          supabase
            .from("bank_accounts")
            .select("balance")
            .eq("user_id", userId),
          supabase
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

          const projections = generateProjections(
            rawTransactions as Transaction[],
            rawSubscriptions as Subscription[],
            currentBalance
          )

          contextJson = JSON.stringify(
            {
              ...summary,
              currentBalance,
              projections,
              recentTransactions: txs.slice(0, 200),
            },
            null,
            2
          )
        }
      } catch (dbError) {
        console.error("Error fetching data for AI context:", dbError)
      }
    }

    const systemPrompt = buildSystemPrompt(
      assistantParams ?? {},
      contextJson
    )

    const result = streamText({
      model: anthropic("claude-sonnet-4-6"),
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
