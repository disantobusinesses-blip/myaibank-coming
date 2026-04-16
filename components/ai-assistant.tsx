"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [{ type: "text", text: "Hi! I'm your AI Financial Assistant. I can analyse your spending, forecast your finances, model investment scenarios, and help you understand your money better. Ask me anything about your finances!" }],
}
import { Button } from "@/components/ui/button"
import ChatGPTInput from "@/components/ui/prompt-input-dynamic-grow"
import {
  X,
  Bot,
  User,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useAppData } from "@/contexts/app-data-context"
import { normalizeTransactions } from "@/lib/transactions-provider"
import { createClient } from "@/lib/supabase/client"

const suggestedQuestions = [
  "What's my financial health score?",
  "If I invested my savings, what would it be worth in 10 years?",
  "Show my biggest expenses this month",
  "How can I improve my savings rate?",
]

const DEMO_AI_LIMIT = 3
const DEMO_AI_COUNT_KEY = "mab_demo_ai_count"
const DISCLAIMER_ACCEPTED_KEY = "mab_ai_disclaimer_accepted"

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

// Helper to check/set disclaimer acceptance (per session)
function getDisclaimerAccepted(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(DISCLAIMER_ACCEPTED_KEY) === "true"
}

function persistDisclaimerAccepted() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(DISCLAIMER_ACCEPTED_KEY, "true")
  }
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
  const [isClosing, setIsClosing] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoAiCount, setDemoAiCount] = useState(0)
  const [demoLimitReached, setDemoLimitReached] = useState(false)
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [disclaimerAccepted, setDisclaimerState] = useState(false)
  const [disclaimerChecked, setDisclaimerChecked] = useState(false)
  const { transactions, accounts } = useAppData()

  // Check demo mode + disclaimer on mount
  useEffect(() => {
    const demo = checkDemoMode()
    setIsDemoMode(demo)
    if (demo) {
      const count = getDemoAiCount()
      setDemoAiCount(count)
      setDemoLimitReached(count >= DEMO_AI_LIMIT)
    }
    setDisclaimerState(getDisclaimerAccepted())
  }, [])

  // Fetch auth token and daily usage for authenticated users
  useEffect(() => {
    const fetchAuthAndUsage = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
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
    fetchAuthAndUsage()
  }, [])

  const aiContext = useMemo(() => {
    const normalized = normalizeTransactions(transactions)
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    const accountSummary = accounts.map(acc => ({
      name: acc.account_name || acc.institution_name || "Account",
      type: acc.account_type || "unknown",
      balance: acc.balance,
      institution: acc.institution_name,
    }))
    return { transactions: normalized, accounts: accountSummary, totalBalance }
  }, [transactions, accounts])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      body: {
        context: aiContext,
        isDemoMode,
        assistantParams: {
          tone: "assistant",
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

  const handleOpen = () => {
    setIsClosing(false)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 250)
  }

  const handleAcceptDisclaimer = () => {
    if (!disclaimerChecked) return
    persistDisclaimerAccepted()
    setDisclaimerState(true)
  }

  const handleSend = (messageText?: string) => {
    const text = (messageText ?? input).trim()
    if (!text || isLoading) return

    // Check demo mode limit
    if (isDemoMode) {
      if (demoAiCount >= DEMO_AI_LIMIT) {
        setDemoLimitReached(true)
        return
      }
      const newCount = incrementDemoAiCount()
      setDemoAiCount(newCount)
      if (newCount >= DEMO_AI_LIMIT) {
        setDemoLimitReached(true)
      }
    }

    sendMessage({ text })
    setInput("")
    setDailyRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null))
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  return (
    <>
      {/* Floating Button — fades out when chat opens */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ai-btn-glow ${
          isOpen ? "pointer-events-none opacity-0 scale-50" : "opacity-100 scale-100"
        }`}
        aria-label="Open AI Financial Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Panel — expands from bottom-right with spring animation */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100%-2rem)] max-w-lg h-[600px] max-h-[80vh] flex flex-col overflow-hidden origin-bottom-right ${
            isClosing ? "animate-ai-chat-close" : "animate-ai-chat-open"
          }`}
          style={{
            background: "linear-gradient(180deg, #0f0f18 0%, #0a0a12 100%)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "1.25rem",
            boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.12)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]" style={{ background: "rgba(124,58,237,0.04)" }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c3aed]/30 to-[#6d28d9]/20 flex items-center justify-center shrink-0 ring-1 ring-[#7c3aed]/20">
              <Bot className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">MyAiBank Financial Assistant</p>
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
                onClick={handleClose}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Disclaimer Gate — shown before any chat interaction */}
          {!disclaimerAccepted ? (
            <div className="flex-1 overflow-y-auto p-6 animate-msg-fade-in">
              <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#6d28d9]/10 flex items-center justify-center mb-5 ring-1 ring-[#7c3aed]/20 animate-ai-disclaimer-pulse">
                <ShieldCheck className="w-8 h-8 text-[#a78bfa]" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">Before we begin</h3>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
                Please read and accept the following disclaimer to continue.
              </p>

              <div
                className="rounded-xl p-4 mb-6 text-left max-w-sm w-full"
                style={{
                  background: "rgba(245,158,11,0.06)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              >
                <p className="text-sm text-[#fbbf24] leading-relaxed">
                  Our AI is not a financial advisor and you should seek financial advice from a licensed professional before taking any actions.
                </p>
              </div>

              <label
                className="flex items-start gap-3 cursor-pointer mb-6 max-w-sm w-full text-left group"
                htmlFor="ai-disclaimer-checkbox"
              >
                <input
                  id="ai-disclaimer-checkbox"
                  type="checkbox"
                  checked={disclaimerChecked}
                  onChange={(e) => setDisclaimerChecked(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-2 border-[#7c3aed]/40 bg-transparent accent-[#7c3aed] cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  I understand and acknowledge that the AI is not a financial advisor. I will seek professional advice before making financial decisions.
                </span>
              </label>

              <button
                onClick={handleAcceptDisclaimer}
                disabled={!disclaimerChecked}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:scale-105 enabled:active:scale-95"
                style={{
                  background: disclaimerChecked
                    ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                    : "rgba(124,58,237,0.3)",
                  boxShadow: disclaimerChecked
                    ? "0 4px 24px rgba(124,58,237,0.3)"
                    : "none",
                }}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Continue to Chat
                </span>
              </button>
              </div>
            </div>
          ) : (
            <>
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
                          <Bot className="w-4 h-4 text-[#a78bfa]" />
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
                        <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-foreground" />
                        </div>
                      )}
                    </div>
                  )
                })}

                {isLoading && (
                  <div className="flex gap-2.5 justify-start animate-msg-fade-in">
                    <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#a78bfa]" />
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
              <div className="p-4 border-t border-white/[0.06]">
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
            </>
          )}
        </div>
      )}
    </>
  )
}
