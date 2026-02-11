"use client"

import React from "react"

import { useAppData } from "@/contexts/app-data-context"
import { Gauge, Home, ShoppingBag, Sparkles } from "lucide-react"

interface BudgetCategory {
  name: string
  target: number
  actual: number
  icon: React.ReactNode
  color: string
}

export default function BudgetAutopilotPage() {
  const { connected, transactions } = useAppData()

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Map transaction categories to 50/30/20 buckets
  const needsCategories = ["Housing", "Groceries", "Transport", "Utilities", "Insurance", "Health & Fitness"]
  const savingsCategories = ["Transfer", "Savings", "Investment"]

  let needsActual = 0
  let wantsActual = 0

  for (const t of transactions) {
    if (t.amount >= 0) continue
    const absAmt = Math.abs(t.amount)
    const catLower = (t.category || "").toLowerCase()
    if (savingsCategories.some((c) => catLower.includes(c.toLowerCase()))) {
      continue
    }
    if (needsCategories.some((c) => catLower.includes(c.toLowerCase()))) {
      needsActual += absAmt
    } else {
      wantsActual += absAmt
    }
  }

  const actualSavings = income - expenses

  // 50/30/20 rule
  const needsTarget = income * 0.5
  const wantsTarget = income * 0.3
  const savingsTarget = income * 0.2

  const categories: BudgetCategory[] = [
    {
      name: "Needs",
      target: needsTarget,
      actual: needsActual,
      icon: <Home className="w-5 h-5" />,
      color: "#22c55e",
    },
    {
      name: "Wants",
      target: wantsTarget,
      actual: wantsActual,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "#8b5cf6",
    },
    {
      name: "Savings",
      target: savingsTarget,
      actual: Math.max(0, actualSavings),
      icon: <Sparkles className="w-5 h-5" />,
      color: "#14b8a6",
    },
  ]

  if (!connected) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">Budget Autopilot</h1>
        <div className="p-8 rounded-2xl bg-card border border-border text-center">
          <p className="text-muted-foreground">Connect your bank to see your budget</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Gauge className="w-8 h-8 text-[#1F0051]" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget Autopilot</h1>
          <p className="text-sm text-muted-foreground">50/30/20 Budget Rule</p>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
        <p className="text-3xl font-bold text-foreground">${income.toLocaleString()}</p>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = category.target > 0 ? (category.actual / category.target) * 100 : 0
          const isOverBudget = percentage > 100

          return (
            <div
              key={category.name}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.name === "Needs" && "50% of income - essentials"}
                      {category.name === "Wants" && "30% of income - lifestyle"}
                      {category.name === "Savings" && "20% of income - future"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${isOverBudget ? "text-destructive" : "text-foreground"}`}>
                    ${category.actual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of ${category.target.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: isOverBudget ? "#ff4d6a" : category.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs font-medium ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}>
                  {percentage.toFixed(0)}% used
                </p>
                {isOverBudget && (
                  <p className="text-xs text-destructive">
                    Over by ${(category.actual - category.target).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="rounded-2xl bg-[#1F0051]/20 border border-[#1F0051]/30 p-4">
        <h3 className="font-semibold text-foreground mb-2">Budget Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>{"• Needs (50%): Housing, utilities, groceries, insurance, minimum debt payments"}</li>
          <li>{"• Wants (30%): Dining out, entertainment, subscriptions, hobbies"}</li>
          <li>{"• Savings (20%): Emergency fund, investments, extra debt payments"}</li>
        </ul>
      </div>
    </div>
  )
}
