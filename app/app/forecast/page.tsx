"use client"

import { useAppData } from "@/contexts/app-data-context"
import { CashflowChart } from "@/components/dashboard/cashflow-chart"
import {
  buildSpendingSummary,
  projectMonthEnd,
  generateProjections,
} from "@/lib/financial-engine"
import { TrendingUp, TrendingDown, Calendar, ShieldCheck, AlertTriangle, Info } from "lucide-react"

const confidenceConfig = {
  high: {
    label: "High confidence",
    icon: ShieldCheck,
    color: "text-[#22c55e]",
    bg: "bg-[#22c55e]/10 border-[#22c55e]/20",
  },
  medium: {
    label: "Medium confidence",
    icon: Info,
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10 border-[#f59e0b]/20",
  },
  low: {
    label: "Low confidence — connect more data",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/20",
  },
}

export default function ForecastPage() {
  const { connected, transactions, subscriptions, totalBalance } = useAppData()

  const summary = buildSpendingSummary(transactions)
  const { projected: projectedMonthEnd, daysRemaining } = projectMonthEnd(transactions, totalBalance)
  const projections = generateProjections(transactions, subscriptions, totalBalance)

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

  const confidenceLevel = projections[0]?.confidenceLevel ?? "low"
  const conf = confidenceConfig[confidenceLevel]
  const ConfIcon = conf.icon

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Cashflow Forecast</h1>

      {/* Confidence Banner */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${conf.bg}`}>
        <ConfIcon className={`w-4 h-4 ${conf.color}`} />
        <p className={`text-sm font-medium ${conf.color}`}>{conf.label}</p>
        <p className="text-xs text-muted-foreground ml-auto">
          Based on {transactions.length} transactions
        </p>
      </div>

      {/* Unified Cashflow Forecast Chart */}
      <CashflowChart />

      {/* 30/60/90 Day Projections */}
      <div>
        <h2 className="font-semibold text-foreground mb-3">Projected Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projections.map((proj) => (
            <div
              key={proj.days}
              className="rounded-2xl bg-card border border-border p-4 space-y-3"
            >
              <p className="text-sm text-muted-foreground font-medium">{proj.days} days</p>
              <p
                className={`text-2xl font-bold ${
                  proj.projectedBalance >= 0 ? "text-[#22c55e]" : "text-destructive"
                }`}
              >
                ${Math.abs(proj.projectedBalance).toLocaleString()}
              </p>
              <div className="space-y-1 pt-1 border-t border-border">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Income</span>
                  <span className="text-[#22c55e]">+${proj.projectedIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expenses</span>
                  <span className="text-destructive">-${proj.projectedExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-foreground pt-1">
                  <span>Net</span>
                  <span className={proj.netCashflow >= 0 ? "text-[#22c55e]" : "text-destructive"}>
                    {proj.netCashflow >= 0 ? "+" : ""}${proj.netCashflow.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Savings rate</span>
                  <span>{(proj.savingsRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month End Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            <p className="text-sm text-muted-foreground">Period Income</p>
          </div>
          <p className="text-2xl font-bold text-[#22c55e]">
            ${summary.totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <p className="text-sm text-muted-foreground">Period Expenses</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${summary.totalExpenses.toLocaleString()}
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
            {projectedMonthEnd >= 0 ? "Surplus" : "Deficit"} · {daysRemaining} days left
          </p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <h2 className="font-semibold text-foreground mb-3">AI Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] mt-2 shrink-0" />
            <p className="text-sm text-foreground">
              {summary.netCashflow >= 0
                ? `Based on your spending patterns, you're on track with a net surplus of $${Math.round(summary.netCashflow).toLocaleString()} this period.`
                : `Your expenses ($${Math.round(summary.totalExpenses).toLocaleString()}) currently exceed your income. Consider reviewing discretionary spending.`}
            </p>
          </div>
          {summary.discretionaryExpenses > summary.essentialExpenses * 0.5 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b] mt-2 shrink-0" />
              <p className="text-sm text-foreground">
                Your discretionary spending is ${Math.round(summary.discretionaryExpenses).toLocaleString()} — that&apos;s {Math.round((summary.discretionaryExpenses / summary.totalExpenses) * 100)}% of total expenses. Consider setting a budget cap.
              </p>
            </div>
          )}
          {projections[2] && projections[2].savingsRate < 0.1 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0" />
              <p className="text-sm text-foreground">
                Your 90-day savings rate is projected at {(projections[2].savingsRate * 100).toFixed(0)}%. Aim for at least 20% to build financial resilience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
