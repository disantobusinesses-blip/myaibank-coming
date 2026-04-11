"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [{ type: "text", text: "Hey! I can see your transactions. Ask me anything: spending totals, merchant breakdowns, category trends, or tips to save." }],
}
import { Button } from "@/components/ui/button"
import ChatGPTInput from "@/components/ui/prompt-input-dynamic-grow"
import {
  X,
  Sparkles,
  User,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useAppData } from "@/contexts/app-data-context"
import { normalizeTransactions } from "@/lib/transactions-provider"
import { createClient } from "@/lib/supabase/client"

const suggestedQuestions = [
  "What are my top spending categories?",
  "How much did I spend on dining?",
  "Show my biggest expenses this month",
  "Do I have any recurring subscriptions?",
]

const DEMO_AI_LIMIT = 3
const DEMO_AI_COUNT_KEY = "mab_demo_ai_count"

// Helper to check demo mode
function checkDemoMode(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem("myaibank_demo_mode") === "true"
}

// Helper to get/set demo AI count
function getDemoAiCount(): number {
  if (typeof window === "undefined") return 0
  const count = sessionStorage.getItem(DEMO_AI_COUNT_KEY)
  return count ? parseInt(count, 10) : 0
}

function incrementDemoAiCount(): number {
  const current = getDemoAiCount()
  const newCount = current + 1
  if (typeof window !== "undefined") {
    sessionStorage.setItem(DEMO_AI_COUNT_KEY, String(newCount))
  }
  return newCount
}

// Helper to extract text from message parts
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoAiCount, setDemoAiCount] = useState(0)
  const [demoLimitReached, setDemoLimitReached] = useState(false)
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null)
  const { transactions } = useAppData()

  // Check demo mode on mount
  useEffect(() => {
    const demo = checkDemoMode()
    setIsDemoMode(demo)
    if (demo) {
      const count = getDemoAiCount()
      setDemoAiCount(count)
      setDemoLimitReached(count >= DEMO_AI_LIMIT)
    }
  }, [])

  // Fetch daily usage for authenticated users
  useEffect(() => {
    const fetchUsage = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const monthYear = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
      const today = new Date().toISOString().split("T")[0]

      const { data } = await supabase
        .from("ai_usage")
        .select("daily_chat_count, usage_date")
        .eq("user_id", user.id)
        .eq("month_year", monthYear)
        .single()

      const used = data?.usage_date === today ? (data?.daily_chat_count ?? 0) : 0
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (messageText?: string) => {
    const text = (messageText ?? input).trim()
    if (!text || isLoading) return
    
    // Check demo mode limit
    if (isDemoMode) {
      if (demoAiCount >= DEMO_AI_LIMIT) {
        setDemoLimitReached(true)
        return
      }
      // Increment the count
      const newCount = incrementDemoAiCount()
      setDemoAiCount(newCount)
      if (newCount >= DEMO_AI_LIMIT) {
        setDemoLimitReached(true)
      }
    }
    
    sendMessage({ text })
    setInput("")
    // Decrement local counter optimistically
    setDailyRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null))
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ai-btn-glow ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open AI Financial Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100%-2rem)] max-w-lg h-[600px] max-h-[80vh] bg-[#0f0f16] border border-[rgba(124,58,237,0.2)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-chat-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/06">
            <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">MyAiBank AI</p>
              <p className="text-[10px] text-muted-foreground">Powered by Claude Opus · Your personal finance assistant</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {dailyRemaining !== null && !isDemoMode && (
                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider hidden sm:block">
                  {dailyRemaining} left today
                </span>
              )}
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/06 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.map((message) => {
              const text = getMessageText(message)
              if (!text) return null
              return (
                <div
                  key={message.id}
                  className={`flex gap-2.5 animate-msg-fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-sm text-white"
                        : "rounded-bl-sm text-[#f5f5f7]"
                    }`}
                    style={message.role === "user" ? {
                      background: "rgba(124,58,237,0.2)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    } : {
                      background: "rgba(124,58,237,0.08)",
                      border: "1px solid rgba(124,58,237,0.15)",
                    }}
                  >
                    {text}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-white/06 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </div>
              )
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-msg-fade-in">
                <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                </div>
                <div className="p-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-bounce-dot" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-bounce-dot" style={{ animationDelay: "160ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-bounce-dot" style={{ animationDelay: "320ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Suggested</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="suggestion-pill text-xs px-3 py-1.5 rounded-full text-muted-foreground"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Demo Limit Message */}
          {isDemoMode && demoLimitReached && (
            <div className="px-4 py-3 border-t border-amber-500/20 bg-amber-500/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-400">Demo limit reached</p>
                  <p className="text-xs text-amber-500/80 mt-0.5">
                    Sign up to continue with unlimited AI questions.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-block mt-2 text-xs font-medium text-[#a78bfa] hover:underline"
                  >
                    Sign up for free →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/06">
            {isDemoMode && !demoLimitReached && (
              <p className="text-[10px] text-muted-foreground/60 text-center pb-2 uppercase tracking-wider">
                Demo · {DEMO_AI_LIMIT - demoAiCount} question{DEMO_AI_LIMIT - demoAiCount !== 1 ? 's' : ''} remaining
              </p>
            )}
            <ChatGPTInput
              placeholder={isDemoMode && demoLimitReached ? "Sign up to continue..." : "Ask about your finances..."}
              onSubmit={(value) => handleSend(value)}
              disabled={isLoading || (isDemoMode && demoLimitReached)}
              textColor="#ffffff"
              showEffects={true}
              menuOptions={["Analysis", "Forecast", "Budget", "Savings"]}
            />
          </div>
        </div>
      )}
    </>
  )
}
