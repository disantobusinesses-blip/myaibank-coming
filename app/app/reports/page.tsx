"use client"

import { useState } from "react"
import { FileText, Sparkles, Lock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function ReportsPage() {
  const { session } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(true)

  const runDeepAnalysis = async () => {
    if (!session?.access_token) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/ai/deep-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Failed to generate analysis.")
        return
      }

      setAnalysis(data.analysis)
      setRemaining(data.remaining)
      setGeneratedAt(new Date(data.generatedAt).toLocaleDateString("en-AU", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }))
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderAnalysis = (text: string) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("## "))
        return <h3 key={i} className="text-base font-semibold text-foreground mt-4 mb-1">{line.replace("## ", "")}</h3>
      if (line.startsWith("- "))
        return <li key={i} className="text-sm text-muted-foreground ml-4 list-disc">{line.replace("- ", "")}</li>
      if (line.startsWith("⚠️"))
        return <p key={i} className="text-xs text-muted-foreground mt-4 italic">{line}</p>
      if (line.trim() === "") return <br key={i} />
      return <p key={i} className="text-sm text-foreground">{line}</p>
    })

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>

      {/* Deep Analysis Card */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer"
          onClick={() => analysis && setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F0051]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="font-semibold text-foreground">AI Deep Financial Analysis</p>
              <p className="text-sm text-muted-foreground">
                {remaining !== null
                  ? remaining === 0
                    ? "Used for this month — resets 1st of next month"
                    : `${remaining} analysis remaining this month`
                  : "1 deep analysis per month included"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {generatedAt && (
              <span className="text-xs text-muted-foreground">• {generatedAt}</span>
            )}
            {analysis && (
              expanded
                ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          {!analysis && !isLoading && (
            <Button
              onClick={runDeepAnalysis}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1F0051] to-[#6b21a8] text-white hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Run Deep Analysis
            </Button>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#6b21a8]" />
              <p className="text-sm text-muted-foreground">
                Analysing 90 days of your financial data...
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              <Lock className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          )}
        </div>

        {analysis && expanded && (
          <div className="p-4 pt-0 border-t border-border space-y-1 max-h-[600px] overflow-y-auto">
            {renderAnalysis(analysis)}
          </div>
        )}
      </div>

      {/* Standard Reports — Coming Soon */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Standard Reports</h2>
        {[
          { name: "Monthly Summary", description: "Income, expenses, and savings overview" },
          { name: "Spending by Category", description: "Full category breakdown with charts" },
          { name: "Subscription Report", description: "All detected recurring payments" },
          { name: "Tax Summary", description: "Annual summary for tax purposes" },
        ].map((r, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F0051]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground shrink-0">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
