"use client"

import { useState, useMemo } from "react"
import { useAppData } from "@/contexts/app-data-context"
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, ReferenceLine,
} from "recharts"
import { TrendingUp, DollarSign, Calculator, Info } from "lucide-react"

// ── Return rate presets ──────────────────────────────────────────────────────
const RATE_PRESETS = [
  { label: "Conservative",  rate: 8,  color: "#14b8a6", desc: "Diversified bonds & shares" },
  { label: "S&P 500 Avg",   rate: 10, color: "#22c55e", desc: "Historical S&P 500 average" },
  { label: "Growth",        rate: 11, color: "#8b5cf6", desc: "High-growth equity portfolio" },
]

// ── Compound interest engine ──────────────────────────────────────────────────
function calcCompound(initial: number, monthly: number, ratePercent: number, years: number) {
  const r = ratePercent / 100 / 12   // monthly rate
  let balance = initial
  let totalContributed = initial
  for (let m = 0; m < years * 12; m++) {
    balance = balance * (1 + r) + monthly
    totalContributed += monthly
  }
  return { balance: Math.round(balance), totalContributed: Math.round(totalContributed) }
}

function buildChartData(initial: number, monthly: number, ratePercent: number) {
  const r = ratePercent / 100 / 12
  const points = []
  let balance = initial
  let totalContributed = initial
  // Generate annually for up to 50 years
  for (let year = 0; year <= 50; year++) {
    if (year > 0) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthly
        totalContributed += monthly
      }
    }
    points.push({
      year,
      balance:    Math.round(balance),
      contributed: Math.round(totalContributed),
      growth:     Math.round(balance - totalContributed),
    })
  }
  return points
}

function fmt(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M"
  if (n >= 1_000)     return "$" + (n / 1_000).toFixed(1)     + "k"
  return "$" + n.toLocaleString()
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const balance    = payload.find((p: any) => p.dataKey === "balance")?.value    ?? 0
  const contributed = payload.find((p: any) => p.dataKey === "contributed")?.value ?? 0
  const growth     = balance - contributed
  return (
    <div className="rounded-2xl p-3 shadow-2xl" style={{ backgroundColor:"#1a1a2e", border:"1px solid rgba(255,255,255,0.12)", minWidth:"180px" }}>
      <p className="font-semibold text-white text-xs mb-2">Year {label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Total value</span>
          <span className="text-xs font-bold text-white">{fmt(balance)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Contributed</span>
          <span className="text-xs font-medium" style={{ color:"#14b8a6" }}>{fmt(contributed)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Investment growth</span>
          <span className="text-xs font-bold" style={{ color:"#22c55e" }}>+{fmt(growth)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { connected } = useAppData()

  // Calculator state
  const [initial,  setInitial]  = useState(10000)
  const [monthly,  setMonthly]  = useState(500)
  const [rateIdx,  setRateIdx]  = useState(1)   // default: S&P 500 Avg

  const preset = RATE_PRESETS[rateIdx]
  const chartData = useMemo(() => buildChartData(initial, monthly, preset.rate), [initial, monthly, preset.rate])

  // Key milestones
  const milestones = [10, 20, 30, 40, 50].map(yr => ({
    year: yr,
    ...calcCompound(initial, monthly, preset.rate, yr),
  }))

  const totalAtYear20 = milestones[1].balance
  const contributed20 = milestones[1].totalContributed
  const growthMultiplier = contributed20 > 0 ? (totalAtYear20 / contributed20).toFixed(1) : "0"

  const inputClass = "w-full h-12 rounded-xl px-4 text-white text-sm font-medium outline-none transition-all focus:ring-2"
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6" style={{ color:"#8b5cf6" }} />
          Investment Compound Calculator
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color:"rgba(255,255,255,0.5)" }}>
          See how your money grows with the power of compound interest — based on real market return averages.
        </p>
      </div>

      {/* ── Rate preset pills ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {RATE_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setRateIdx(i)}
            className="flex-1 p-3 sm:p-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: rateIdx === i ? `${p.color}22` : "rgba(255,255,255,0.04)",
              border: rateIdx === i ? `1px solid ${p.color}55` : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: rateIdx===i ? p.color : "rgba(255,255,255,0.6)" }}>{p.label}</span>
              <span className="text-lg sm:text-xl font-bold text-white">{p.rate}%</span>
            </div>
            <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>{p.desc}</p>
          </button>
        ))}
      </div>

      {/* ── Input row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color:"rgba(255,255,255,0.55)" }}>
            Initial Deposit (AUD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(255,255,255,0.4)" }} />
            <input
              type="number" min={0} step={1000}
              value={initial}
              onFocus={e => e.target.select()}
              onChange={e => {
                const raw = e.target.value.replace(/^0+(\d)/, '$1')
                setInitial(raw === '' ? 0 : Math.max(0, Number(raw)))
              }}
              className={inputClass}
              style={{ ...inputStyle, paddingLeft:"2.25rem" }}
            />
          </div>
          {/* Quick preset buttons */}
          <div className="flex gap-2 mt-2">
            {[5000, 10000, 25000, 50000].map(v => (
              <button key={v} onClick={() => setInitial(v)}
                className="flex-1 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{ background: initial===v ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.05)", color: initial===v ? "#c4b5fd" : "rgba(255,255,255,0.5)", border: initial===v ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)" }}>
                ${(v/1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color:"rgba(255,255,255,0.55)" }}>
            Monthly Contribution (AUD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(255,255,255,0.4)" }} />
            <input
              type="number" min={0} step={100}
              value={monthly}
              onFocus={e => e.target.select()}
              onChange={e => {
                const raw = e.target.value.replace(/^0+(\d)/, '$1')
                setMonthly(raw === '' ? 0 : Math.max(0, Number(raw)))
              }}
              className={inputClass}
              style={{ ...inputStyle, paddingLeft:"2.25rem" }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[250, 500, 1000, 2000].map(v => (
              <button key={v} onClick={() => setMonthly(v)}
                className="flex-1 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{ background: monthly===v ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.05)", color: monthly===v ? "#c4b5fd" : "rgba(255,255,255,0.5)", border: monthly===v ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)" }}>
                ${v < 1000 ? v : (v/1000)+"k"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-semibold text-white text-sm">Portfolio Growth — 50 Year Projection</h3>
              <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>
                {preset.label} · {preset.rate}% annual return · Compounded monthly
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Value at 20 years</p>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: preset.color }}>{fmt(totalAtYear20)}</p>
            </div>
          </div>
        </div>

        <div className="h-56 sm:h-72 lg:h-80 px-1 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top:8, right:8, left:-10, bottom:0 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={preset.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={preset.color} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" axisLine={false} tickLine={false}
                tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10 }}
                tickFormatter={v => v===0?"Now":"Yr "+v} interval={9} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10 }}
                tickFormatter={v => v>=1000000 ? "$"+(v/1000000).toFixed(1)+"M" : v>=1000 ? "$"+(v/1000).toFixed(0)+"k" : "$"+v} />
              <Tooltip content={<ChartTooltip />} />

              {/* Reference lines at 10, 20, 30 year marks */}
              {[10, 20, 30].map(yr => (
                <ReferenceLine key={yr} x={yr} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3"
                  label={{ value:`${yr}yr`, fill:"rgba(255,255,255,0.3)", fontSize:9, position:"top" }} />
              ))}

              {/* Contributed amount (bottom layer) */}
              <Area type="monotone" dataKey="contributed"
                stroke="#14b8a6" strokeWidth={1.5}
                fill="url(#contribGrad)"
                dot={false} name="Contributed" />

              {/* Total portfolio (top layer) */}
              <Area type="monotone" dataKey="balance"
                stroke={preset.color} strokeWidth={2.5}
                fill="url(#totalGrad)"
                dot={false} name="Portfolio Value"
                activeDot={{ r:5, fill:preset.color, stroke:"#fff", strokeWidth:2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-4 sm:px-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 rounded" style={{ background: preset.color }} />
            <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Portfolio value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 rounded" style={{ background:"#14b8a6" }} />
            <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Amount contributed</span>
          </div>
          <p className="text-xs ml-auto" style={{ color:"rgba(255,255,255,0.35)" }}>The gap = compound returns</p>
        </div>
      </div>

      {/* ── Milestone cards ──────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Projected Milestones</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {milestones.map(({ year, balance, totalContributed }) => {
            const growth = balance - totalContributed
            const ratio  = totalContributed > 0 ? (balance / totalContributed).toFixed(1) : "1"
            return (
              <div key={year} className="p-4 rounded-2xl"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs mb-2 font-semibold" style={{ color:"rgba(255,255,255,0.45)" }}>Year {year}</p>
                <p className="text-lg sm:text-xl font-bold text-white leading-tight">{fmt(balance)}</p>
                <p className="text-xs mt-1" style={{ color: preset.color }}>×{ratio} return</p>
                <div className="mt-2 pt-2" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Growth: <span style={{color:"#22c55e"}}>+{fmt(growth)}</span></p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Info banner ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)" }}>
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color:"#a78bfa" }} />
        <p className="text-xs leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>
          <span className="font-semibold text-white">Disclaimer:</span> This calculator is illustrative only and does not constitute financial advice.
          The S&P 500 has historically returned ~10% annually including dividends, but past performance does not guarantee future results.
          Returns are shown pre-tax and do not account for inflation, fees, or brokerage costs. Consult a licensed financial adviser before investing.
        </p>
      </div>
    </div>
  )
}
