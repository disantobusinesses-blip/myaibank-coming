"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { Bot, Loader2, Sparkles, User } from "lucide-react"
import ChatGPTInput from "@/components/ui/prompt-input-dynamic-grow"
import { useAuth } from "@/contexts/auth-context"
import { useAppData } from "@/contexts/app-data-context"
import { normalizeTransactions } from "@/lib/transactions-provider"
import { createClient } from "@/lib/supabase/client"

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hey! I'm your AI Financial Copilot. I can see your transactions — ask me anything about your spending, savings, subscriptions, or how to improve your finances.",
    },
  ],
}

const suggestedQuestions = [
  "What are my top spending categories?",
  "How much did I spend on dining this month?",
  "Do I have any unused subscriptions?",
  "How can I save more money?",
]

function getMessageText(message: {
  parts?: Array<{ type: string; text?: string }>
}): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof p.text === "string"
    )
    .map((p) => p.text)
    .join("")
}

export default function CopilotPage() {
  const { session } = useAuth()
  const { transactions } = useAppData()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null)

  // Fetch daily usage on mount
  useEffect(() => {
    const fetchUsage = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const monthYear = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
      const today = new Date().toISOString().split("T")[0]

      const { data } = await supabase
        .from("ai_usage")
        .select("daily_chat_count, usage_date")
        .eq("user_id", user.id)
        .eq("month_year", monthYear)
        .single()

      const used =
        data?.usage_date === today ? (data?.daily_chat_count ?? 0) : 0
      setDailyRemaining(50 - used)
    }
    fetchUsage()
  }, [])

  const aiContext = useMemo(() => {
    const normalized = normalizeTransactions(transactions)
    return { transactions: normalized }
  }, [transactions])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      headers: () => ({
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      }),
      body: {
        context: aiContext,
        assistantParams: {
          tone: "advisor",
          verbosity: "normal",
          riskSensitivity: "medium",
          locale: "AU",
        },
      },
    }),
    messages: [WELCOME_MESSAGE],
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (value: string) => {
    const text = value.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setDailyRemaining((prev) =>
      prev !== null ? Math.max(0, prev - 1) : null
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 lg:p-6 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-[#1F0051]/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">AI Financial Copilot</h1>
          <p className="text-xs text-muted-foreground">Powered by Claude · Your personal finance assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 no-scrollbar">
        {messages.map((message) => {
          const text = getMessageText(message)
          if (!text) return null
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#1F0051]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#8b5cf6]" />
                </div>
              )}
              <div
                className={`max-w-[80%] lg:max-w-[70%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  message.role === "user"
                    ? "bg-[#1F0051] text-white rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                }`}
              >
                {text}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-foreground" />
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#1F0051]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-[#8b5cf6]" />
            </div>
            <div className="bg-secondary p-4 rounded-2xl rounded-bl-sm">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions — shown until user sends first message */}
      {messages.length <= 1 && (
        <div className="px-4 lg:px-6 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 lg:p-6 border-t border-border">
        {dailyRemaining !== null && (
          <p className="text-xs text-muted-foreground text-center pb-2">
            {dailyRemaining} AI messages remaining today
          </p>
        )}
        <ChatGPTInput
          placeholder="Ask about your finances..."
          onSubmit={(value) => handleSendMessage(value)}
          disabled={isLoading}
          textColor="#ffffff"
          showEffects={true}
          menuOptions={["Analysis", "Forecast", "Budget", "Savings"]}
        />
      </div>
    </div>
  )
}
