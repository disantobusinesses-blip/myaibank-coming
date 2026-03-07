"use client"

import { useState, useMemo } from "react"
import { useAppData } from "@/contexts/app-data-context"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { AnimatedContent } from "@/components/animated-content"
import { SplitText } from "@/components/split-text"

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

const categories = ["All", "Groceries", "Income", "Dining", "Transport", "Housing", "Subscriptions", "Utilities", "Health", "Shopping", "Entertainment", "Insurance", "Travel", "Home", "Pets", "Charity"]

export default function TransactionsPage() {
  const { transactions, connected } = useAppData()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        (t.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (t.merchant_name ?? "").toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" ||
        (t.category ?? "").toLowerCase() === selectedCategory.toLowerCase()
      return matchesSearch && matchesCategory
    })
  }, [transactions, search, selectedCategory])

  if (!connected) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">Transactions</h1>
        <div className="p-8 rounded-2xl bg-card border border-border text-center">
          <p className="text-muted-foreground">Connect your bank to see transactions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <AnimatedContent animation="fade-up" delay={0}>
        <h1 className="text-2xl font-bold text-foreground">
          <SplitText text="Transactions" charDelay={40} />
        </h1>
      </AnimatedContent>

      {/* Search */}
      <AnimatedContent animation="fade-up" delay={60}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-input border-border"
          />
        </div>
      </AnimatedContent>

      {/* Category Filter */}
      <AnimatedContent animation="fade-up" delay={100}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-[#1F0051] text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </AnimatedContent>

      {/* Transactions List */}
      <AnimatedContent animation="fade-up" delay={140}>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(transaction.category)}`}
                  >
                    {transaction.category ? titleCase(transaction.category) : "Other"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground break-words">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold sm:text-right ${
                    transaction.amount > 0 ? "text-[#22c55e]" : "text-foreground"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  ${Math.abs(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </AnimatedContent>
    </div>
  )
}
