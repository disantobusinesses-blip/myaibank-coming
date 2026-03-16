"use client"

import { useAppData } from "@/contexts/app-data-context"
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"

export default function CashflowPage() {
  const { connected, transactions } = useAppData()

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netCashflow = income - expenses

  // Group by category
  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (t.amount < 0) {
      const cat = t.category || t.merchant_category || "uncategorized"
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount)
    }
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const colors = ["#8b5cf6", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6", "#6366f1"]

  if (!connected) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">Cashflow</h1>
        <div className="p-8 rounded-2xl bg-card border border-border text-center">
          <p className="text-muted-foreground">Connect your bank to see cashflow</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Cashflow Analysis</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
            <p className="text-xs text-muted-foreground">Income</p>
          </div>
          <p className="text-lg font-bold text-[#22c55e]">
            ${income.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownRight className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Expenses</p>
          </div>
          <p className="text-lg font-bold text-foreground">
            ${expenses.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowLeftRight className="w-4 h-4 text-[#8b5cf6]" />
            <p className="text-xs text-muted-foreground">Net</p>
          </div>
          <p className={`text-lg font-bold ${netCashflow >= 0 ? "text-[#22c55e]" : "text-destructive"}`}>
            {netCashflow >= 0 ? "+" : ""}${netCashflow.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Breakdown Chart */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <h2 className="font-semibold text-foreground mb-4">Expense Breakdown</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#8b8b9a", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#f5f5f7", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                        <p className="text-xs text-muted-foreground">{payload[0].payload.name}</p>
                        <p className="text-sm font-semibold text-foreground">
                          ${payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <p className="font-medium text-foreground">{item.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${item.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {((item.value / expenses) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
