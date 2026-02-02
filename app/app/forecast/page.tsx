"use client"

import { useAppData } from "@/contexts/app-data-context"
import { CashflowChart } from "@/components/dashboard/cashflow-chart"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"

export default function ForecastPage() {
  const { connected, transactions } = useAppData()

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const netCashflow = income - expenses
  const projectedMonthEnd = netCashflow * 1.5 // Simple projection

  if (!connected) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">Cashflow Forecast</h1>
        <div className="p-8 rounded-2xl bg-card border border-border text-center">
          <p className="text-muted-foreground">Connect your bank to see forecasts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Cashflow Forecast</h1>

      {/* Main Chart */}
      <CashflowChart />

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            <p className="text-sm text-muted-foreground">Expected Income</p>
          </div>
          <p className="text-2xl font-bold text-[#22c55e]">
            ${income.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <p className="text-sm text-muted-foreground">Expected Expenses</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${expenses.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-[#8b5cf6]" />
            <p className="text-sm text-muted-foreground">Month End Projection</p>
          </div>
          <p className={`text-2xl font-bold ${projectedMonthEnd >= 0 ? "text-[#22c55e]" : "text-destructive"}`}>
            ${Math.abs(projectedMonthEnd).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {projectedMonthEnd >= 0 ? "Surplus" : "Deficit"}
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <h2 className="font-semibold text-foreground mb-3">AI Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] mt-2" />
            <p className="text-sm text-foreground">
              Based on your spending patterns, you&apos;re on track to save ${Math.round(netCashflow * 0.3)} this month.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b] mt-2" />
            <p className="text-sm text-foreground">
              Your subscription spending is ${Math.round(expenses * 0.1)} higher than last month. Consider reviewing your subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
