"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  X, 
  Send, 
  Loader2, 
  Sparkles,
  Bot,
  User,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useAppData } from "@/contexts/app-data-context"
import { normalizeTransactions } from "@/lib/transactions-provider"

const suggestedQuestions = [
  "How can I save more money?",
  "Explain the 50/30/20 budget rule",
  "What subscriptions should I cancel?",
  "Help me create a budget",
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

  const aiContext = useMemo(() => {
    const normalized = normalizeTransactions(transactions)
    return { transactions: normalized }
  }, [transactions])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    body: {
      context: aiContext,
      assistantParams: {
        tone: "advisor",
        verbosity: "normal",
        riskSensitivity: "medium",
        locale: "AU",
      },
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: "Hi! I'm your AI Financial Assistant. I can help you analyse your spending, create budgets, and provide general financial guidance. How can I help you today?" }],
      },
    ],
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    
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
    
    sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#1F0051] to-[#6b21a8] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open AI Financial Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100%-2rem)] max-w-md h-[500px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-[#1F0051] to-[#2d1b69]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Financial Assistant</h3>
                <p className="text-xs text-white/70">Powered by MyAiBank</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((message) => {
              const text = getMessageText(message)
              if (!text) return null
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-[#1F0051]/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#1F0051]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-[#1F0051] text-white rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {text}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </div>
              )
            })}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#1F0051]/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-[#1F0051]" />
                </div>
                <div className="bg-secondary p-3 rounded-2xl rounded-bl-md">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Demo Limit Message */}
          {isDemoMode && demoLimitReached && (
            <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Demo limit reached</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Sign up to continue using the AI Financial Assistant with unlimited questions.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-block mt-2 text-xs font-medium text-[#1F0051] hover:underline"
                  >
                    Sign up to continue
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isDemoMode && demoLimitReached ? "Sign up to continue..." : "Ask me anything..."}
                className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading || (isDemoMode && demoLimitReached)}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || (isDemoMode && demoLimitReached)}
                size="icon"
                className="bg-[#1F0051] hover:bg-[#1F0051]/90 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {isDemoMode && !demoLimitReached && (
              <p className="text-xs text-muted-foreground mt-2">
                Demo mode: {DEMO_AI_LIMIT - demoAiCount} question{DEMO_AI_LIMIT - demoAiCount !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
