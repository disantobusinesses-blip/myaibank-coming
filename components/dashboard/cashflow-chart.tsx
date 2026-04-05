"use client"

import { useAppData } from "@/contexts/app-data-context"
import { generateForecast } from "@/lib/financial-engine"
import { demoForecastData } from "@/lib/demo-data"
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react"
import {
  ComposedChart, Area, Line, XAxis, YAxis,
  ResponsiveContainer, Tooltip, ReferenceLine,
  CartesianGrid, Legend,
} from "recharts"

// ── Custom tooltip ─────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const income   = payload.find((p: any) => p.dataKey === "income")?.value   ?? 0
  const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value ?? 0
  const net      = income - expenses
  const isFuture = payload[0]?.payload?.isAiForecast

  return (
    <div className="rounded-2xl p-3 shadow-2xl text-sm"
      style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", minWidth: "170px" }}>
      <div className="flex items-center gap-1.5 mb-2">
        {isFuture && <Sparkles className="w-3 h-3" style={{ color:"#8b5cf6" }} />}
        <p className="font-semibold text-white text-xs">{label}{isFuture ? " (AI Forecast)" : ""}</p>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Income</span>
          <span className="text-xs font-medium" style={{ color:"#22c55e" }}>+${income.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Expenses</span>
          <span className="text-xs font-medium" style={{ color:"#ef4444" }}>-${expenses.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4 pt-1" style={{ borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-xs font-semibold text-white">Net</span>
          <span className="text-xs font-bold" style={{ color: net >= 0 ? "#22c55e" : "#ef4444" }}>
            {net >= 0 ? "+" : ""}${net.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export function CashflowChart() {
  const { transactions, subscriptions, isDemoMode } = useAppData()

  // In demo mode use pre-built forecast; otherwise compute from real transactions
  const data = isDemoMode
    ? demoForecastData
    : generateForecast(transactions, subscriptions).data

  const todayIndex = data.findIndex(d => d.isToday)
  const todayLabel = data[todayIndex]?.date ?? ""

  // Separate into historical and forecast segments for legend
  const historicalCount = data.filter(d => !d.isFuture).length
  const forecastCount   = data.filter(d => d.isFuture).length

  // Summary numbers (last 12 weeks vs next 12 weeks)
  const hist   = data.filter(d => !d.isFuture && !d.isToday)
  const future = data.filter(d => d.isFuture)

  const avgHistIncome   = hist.length   ? Math.round(hist.reduce((s,d)=>s+d.income,0)   / hist.length)   : 0
  const avgHistExp      = hist.length   ? Math.round(hist.reduce((s,d)=>s+d.expenses,0) / hist.length)   : 0
  const avgFutureIncome = future.length ? Math.round(future.reduce((s,d)=>s+d.income,0)   / future.length) : 0
  const avgFutureExp    = future.length ? Math.round(future.reduce((s,d)=>s+d.expenses,0) / future.length) : 0

  const incomeChange   = avgHistIncome > 0 ? ((avgFutureIncome - avgHistIncome) / avgHistIncome * 100).toFixed(1) : "0"
  const expensesChange = avgHistExp    > 0 ? ((avgFutureExp    - avgHistExp)    / avgHistExp    * 100).toFixed(1) : "0"

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">Cash Flow Forecast</h3>
            <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.45)" }}>
              Historical data · AI-projected future · Weekly view
            </p>
          </div>
          {isDemoMode && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto"
              style={{ background:"rgba(139,92,246,0.2)", border:"1px solid rgba(139,92,246,0.35)", color:"#c4b5fd" }}>
              <Sparkles className="w-3 h-3" />
              AI Forecast Active
            </div>
          )}
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
            style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)" }}>
            <TrendingUp className="w-3 h-3" style={{ color:"#22c55e" }} />
            <span style={{ color:"rgba(255,255,255,0.6)" }}>Avg income/wk</span>
            <span className="font-semibold" style={{ color:"#22c55e" }}>${avgHistIncome.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
            style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)" }}>
            <TrendingDown className="w-3 h-3" style={{ color:"#ef4444" }} />
            <span style={{ color:"rgba(255,255,255,0.6)" }}>Avg expenses/wk</span>
            <span className="font-semibold" style={{ color:"#ef4444" }}>${avgHistExp.toLocaleString()}</span>
          </div>
          {future.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
              style={{ background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)" }}>
              <Sparkles className="w-3 h-3" style={{ color:"#a78bfa" }} />
              <span style={{ color:"rgba(255,255,255,0.6)" }}>AI projected income</span>
              <span className="font-semibold" style={{ color: parseFloat(incomeChange)>=0?"#22c55e":"#ef4444" }}>
                {parseFloat(incomeChange)>=0?"+":""}{incomeChange}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Chart ──────────────────────────────────────────────────────── */}
      <div className="h-56 sm:h-72 lg:h-80 px-1 sm:px-2 pb-3 sm:pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              {/* Historical gradients */}
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
              {/* AI forecast gradient — purple tint */}
              <linearGradient id="aiIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10 }}
              tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`}
            />

            <Tooltip content={<ChartTooltip />} />

            {/* Today reference line */}
            {todayLabel && (
              <ReferenceLine
                x={todayLabel}
                stroke="rgba(255,255,255,0.3)"
                strokeDasharray="4 4"
                label={{ value:"Today", fill:"rgba(255,255,255,0.5)", fontSize:10, position:"insideTopRight" }}
              />
            )}

            {/* Historical income area */}
            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={{ r:4, fill:"#22c55e", stroke:"#fff", strokeWidth:2 }}
              name="Income"
              connectNulls
            />

            {/* Historical expenses area */}
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#expensesGrad)"
              dot={false}
              activeDot={{ r:4, fill:"#ef4444", stroke:"#fff", strokeWidth:2 }}
              name="Expenses"
              connectNulls
            />

            {/* AI forecast income overlay — dashed purple line over future points */}
            <Line
              type="monotone"
              dataKey={(d: any) => d.isAiForecast ? d.income : null}
              stroke="#8b5cf6"
              strokeWidth={2.5}
              strokeDasharray="8 4"
              dot={false}
              activeDot={{ r:4, fill:"#8b5cf6", stroke:"#fff", strokeWidth:2 }}
              name="AI Forecast"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-4 sm:px-6 pb-4 sm:pb-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 rounded" style={{ background:"#22c55e" }} />
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Historical income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 rounded" style={{ background:"#ef4444" }} />
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Historical expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="20" height="4" viewBox="0 0 20 4"><line x1="0" y1="2" x2="20" y2="2" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="8 4" /></svg>
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>AI forecast</span>
        </div>
        {isDemoMode && (
          <p className="text-xs ml-auto" style={{ color:"rgba(139,92,246,0.7)" }}>
            ✦ Powered by MyAiBank AI
          </p>
        )}
      </div>
    </div>
  )
}
