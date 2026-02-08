"use client"

import { useState, useMemo } from "react"
import { useAppData } from "@/contexts/app-data-context"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

const categoryColors: Record<string, string> = {
  Groceries: "bg-[#22c55e]/20 text-[#22c55e]",
  Income: "bg-[#14b8a6]/20 text-[#14b8a6]",
  Entertainment: "bg-[#8b5cf6]/20 text-[#8b5cf6]",
  "Food & Dining": "bg-[#f59e0b]/20 text-[#f59e0b]",
  Transport: "bg-[#6366f1]/20 text-[#6366f1]",
  Housing: "bg-[#ec4899]/20 text-[#ec4899]",
  default: "bg-secondary text-muted-foreground",
}

const categories = ["All", "Groceries", "Income", "Entertainment", "Food & Dining", "Transport", "Housing"]

export default function TransactionsPage() {
  const { transactions, connected } = useAppData()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.merchant?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory
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
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Transactions</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 rounded-xl bg-input border-border"
        />
      </div>

      {/* Category Filter */}
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

      {/* Transactions List */}
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
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    categoryColors[transaction.category] || categoryColors.default
                  }`}
                >
                  {transaction.category}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground break-words">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
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
    </div>
  )
}
