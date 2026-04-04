"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Transaction } from "@/contexts/app-data-context"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const categoryConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  groceries:       { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   emoji: "🛒" },
  income:          { color: "#14b8a6", bg: "rgba(20,184,166,0.12)",  emoji: "💰" },
  entertainment:   { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", emoji: "🎬" },
  dining:          { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  emoji: "🍽️" },
  "food & dining": { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  emoji: "🍽️" },
  transport:       { color: "#6366f1", bg: "rgba(99,102,241,0.12)",  emoji: "🚗" },
  housing:         { color: "#ec4899", bg: "rgba(236,72,153,0.12)",  emoji: "🏠" },
  subscriptions:   { color: "#a855f7", bg: "rgba(168,85,247,0.12)", emoji: "🔄" },
  utilities:       { color: "#f97316", bg: "rgba(249,115,22,0.12)",  emoji: "⚡" },
  health:          { color: "#10b981", bg: "rgba(16,185,129,0.12)",  emoji: "❤️" },
  shopping:        { color: "#f472b6", bg: "rgba(244,114,182,0.12)", emoji: "🛍️" },
  insurance:       { color: "#0ea5e9", bg: "rgba(14,165,233,0.12)",  emoji: "🛡️" },
  travel:          { color: "#eab308", bg: "rgba(234,179,8,0.12)",   emoji: "✈️" },
  savings:         { color: "#14b8a6", bg: "rgba(20,184,166,0.12)",  emoji: "💎" },
  investment:      { color: "#7c3aed", bg: "rgba(124,58,237,0.12)",  emoji: "📈" },
}

const defaultConfig = { color: "#8b8b9a", bg: "rgba(139,139,154,0.1)", emoji: "💳" }

function getCategoryConfig(category: string | null) {
  if (!category) return defaultConfig
  return categoryConfig[category.toLowerCase()] || defaultConfig
}

function titleCase(str: string): string {
  return str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="card-glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-foreground">Recent Transactions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Latest activity</p>
        </div>
        <Link
          href="/app/transactions"
          className="flex items-center gap-1.5 text-xs font-medium text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-1">
        {transactions.map((transaction) => {
          const config = getCategoryConfig(transaction.category)
          const isPositive = transaction.amount > 0
          return (
            <div
              key={transaction.id}
              className="transaction-row flex items-center justify-between py-2.5 px-2 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: config.bg }}
                >
                  {config.emoji}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: config.color }}
                    >
                      {transaction.category ? titleCase(transaction.category) : "Other"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">
                      {new Date(transaction.transaction_date).toLocaleDateString("en-AU", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p
                className={`text-sm font-bold tabular-nums ${
                  isPositive ? "text-[#22c55e]" : "text-foreground"
                }`}
              >
                {isPositive ? "+" : "−"}$
                {Math.abs(transaction.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )
        })}

        {transactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No recent transactions</p>
          </div>
        )}
      </div>
    </div>
  )
}
