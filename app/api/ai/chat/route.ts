import {
  streamText,
  convertToModelMessages,
  UIMessage,
} from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const maxDuration = 30

const FINANCE_SYSTEM_PROMPT = `You are MyAiBank's AI financial assistant. You help users understand their finances, budgeting, and provide general money management tips.

Important guidelines:
- You provide GENERAL financial information only, not personalized financial advice
- You do NOT provide investment advice, tax advice, or specific recommendations
- Always recommend users seek professional advice for important financial decisions
- Be helpful, friendly, and concise
- Focus on budgeting, saving tips, and understanding spending patterns
- If asked about specific investments or complex tax situations, politely decline and suggest consulting a professional
- Keep responses concise and actionable
- Use bullet points or numbered lists when appropriate for clarity`

export async function POST(req: Request) {
  try {
    const { messages, context }: { messages: UIMessage[]; context?: Record<string, unknown> } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const contextPrompt = context
      ? `\n\nContext (user transactions and aggregates):\n${JSON.stringify(context, null, 2)}`
      : ""

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `${FINANCE_SYSTEM_PROMPT}${contextPrompt}`,
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
