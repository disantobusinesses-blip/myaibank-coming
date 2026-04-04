"use client"

import { BarChart3, Clock } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

      <div className="rounded-2xl bg-card border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1F0051]/20 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-[#8b5cf6]" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Advanced Analytics
        </h2>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Deep insights into your spending patterns, trends, and financial behavior. Coming soon!
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>
      </div>
    </div>
  )
}
