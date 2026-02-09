import {
  streamText,
  convertToModelMessages,
  UIMessage,
} from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import {
  NormalizedTransaction,
  filterTransactions,
  buildTransactionSummary,
  TransactionFilters,
} from "@/lib/transactions-provider"

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
    brief: "Keep answers concise — 2–4 sentences max, use bullet points.",
    normal: "Provide clear, moderately detailed answers with actionable steps.",
    detailed:
      "Give thorough, well-structured answers with explanations, examples, and next steps.",
  }

  const toneGuide: Record<string, string> = {
    advisor:
      "Speak like a friendly, professional financial advisor. Use phrases like 'I noticed…', 'You might consider…', 'Based on your spending…'. Be warm but knowledgeable.",
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
    "- When you reference the user's data, cite specifics (e.g. 'I noticed you spent $X at Y this month').",
    "- Provide actionable next steps when relevant.",
    "- NEVER claim to be a licensed financial adviser or provide specific investment, tax, or legal advice.",
    "- If the user asks for specific investment or tax advice, politely decline and recommend consulting a qualified professional.",
    "- Always end responses that contain financial analysis or recommendations with the following disclaimer:",
    `  ${DISCLAIMER}`,
    "",
  ]

  if (contextJson) {
    parts.push(
      "## User financial context (transactions & aggregates)",
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
      context,
      filters,
      assistantParams,
    }: {
      messages: UIMessage[]
      context?: {
        transactions?: NormalizedTransaction[]
        [key: string]: unknown
      }
      filters?: TransactionFilters
      assistantParams?: AssistantParams
    } = body

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Apply server-side filtering to transactions if provided
    let contextJson: string | null = null
    if (context) {
      let txs = (context.transactions ?? []) as NormalizedTransaction[]
      if (filters) {
        txs = filterTransactions(txs, filters)
      }
      const summary = buildTransactionSummary(txs)
      contextJson = JSON.stringify(
        { ...summary, transactions: txs.slice(0, 100) },
        null,
        2
      )
    }

    const systemPrompt = buildSystemPrompt(
      assistantParams ?? {},
      contextJson
    )

    const result = streamText({
      model: openai("gpt-4o-mini"),
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
