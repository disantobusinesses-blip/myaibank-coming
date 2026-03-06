"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Transaction } from "@/contexts/app-data-context"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const categoryColors: Record<string, string> = {
  groceries: "bg-[#22c55e]/20 text-[#22c55e]",
  income: "bg-[#14b8a6]/20 text-[#14b8a6]",
  entertainment: "bg-[#8b5cf6]/20 text-[#8b5cf6]",
  dining: "bg-[#f59e0b]/20 text-[#f59e0b]",
  "food & dining": "bg-[#f59e0b]/20 text-[#f59e0b]",
  transport: "bg-[#6366f1]/20 text-[#6366f1]",
  housing: "bg-[#ec4899]/20 text-[#ec4899]",
  subscriptions: "bg-[#a855f7]/20 text-[#a855f7]",
  utilities: "bg-[#f97316]/20 text-[#f97316]",
  health: "bg-[#10b981]/20 text-[#10b981]",
  shopping: "bg-[#f472b6]/20 text-[#f472b6]",
  insurance: "bg-[#0ea5e9]/20 text-[#0ea5e9]",
  travel: "bg-[#eab308]/20 text-[#eab308]",
  home: "bg-[#ec4899]/20 text-[#ec4899]",
  pets: "bg-[#84cc16]/20 text-[#84cc16]",
  charity: "bg-[#14b8a6]/20 text-[#14b8a6]",
}

const defaultColor = "bg-secondary text-muted-foreground"

function getCategoryColor(category: string | null): string {
  if (!category) return defaultColor
  return categoryColors[category.toLowerCase()] || defaultColor
}

function titleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Recent Transactions</h2>
        <Link
          href="/app/transactions"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <div
                className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(transaction.category)}`}
              >
                {transaction.category ? titleCase(transaction.category) : "Other"}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.transaction_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p
              className={`text-sm font-semibold ${
                transaction.amount > 0 ? "text-[#22c55e]" : "text-foreground"
              }`}
            >
              {transaction.amount > 0 ? "+" : ""}
              ${Math.abs(transaction.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
