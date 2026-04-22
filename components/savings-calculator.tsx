"use client"

import { useState, useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const WEEKLY_DEPOSIT = 500
const ANNUAL_RATE = 0.055
const WEEKS_PER_YEAR = 52

function formatDollar(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  return `$${Math.round(value / 1000)}K`
}

function buildChartData(years: number) {
  const data = []
  let balance = 0
  // Effective weekly rate derived from the annual rate using compound interest:
  // (1 + annual_rate)^(1/52) - 1  — more accurate than dividing annual rate by 52
  const weeklyRate = Math.pow(1 + ANNUAL_RATE, 1 / WEEKS_PER_YEAR) - 1

  for (let year = 1; year <= years; year++) {
    for (let w = 0; w < WEEKS_PER_YEAR; w++) {
      balance = (balance + WEEKLY_DEPOSIT) * (1 + weeklyRate)
    }
    const totalContributed = year * WEEKS_PER_YEAR * WEEKLY_DEPOSIT
    const interestEarned = balance - totalContributed
    data.push({
      year: `Yr ${year}`,
      contributions: Math.round(totalContributed),
      interest: Math.round(interestEarned),
    })
  }

  return data
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4, color: "#180D27" }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: "2px 0" }}>
          {entry.name === "contributions" ? "Your Contributions" : "Interest Earned"}:{" "}
          <strong>{formatDollar(entry.value)}</strong>
        </p>
      ))}
    </div>
  )
}

export function SavingsCalculator() {
  const [years, setYears] = useState(10)

  const data = useMemo(() => buildChartData(years), [years])

  const lastPoint = data[data.length - 1]
  const totalBalance = lastPoint.contributions + lastPoint.interest
  const totalContributed = lastPoint.contributions
  const interestEarned = lastPoint.interest

  return (
    <div
      style={{
        background: "#f9f7fc",
        border: "1px solid #e8e0f0",
        borderRadius: 20,
        padding: "28px 24px",
        margin: "32px 0",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#180D27",
            margin: 0,
          }}
        >
          Savings Growth Calculator
        </h3>
        <p style={{ fontSize: 13, color: "#777", marginTop: 4, marginBottom: 0 }}>
          $500/week · 5.5% p.a. compound interest
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total Balance", value: totalBalance, color: "#7c3aed" },
          { label: "You Contributed", value: totalContributed, color: "#475569" },
          { label: "Interest Earned", value: interestEarned, color: "#2563eb" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1px solid #e8e0f0",
              borderRadius: 12,
              padding: "14px 16px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 11, color: "#999", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color, margin: 0 }}>
              {formatDollar(value)}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="scSlate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#475569" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#475569" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="scBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              horizontal
              vertical={false}
              strokeDasharray="4 4"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              interval={Math.max(0, Math.ceil(years / 6) - 1)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(v: number) => formatDollar(v)}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="contributions"
              stackId="1"
              stroke="#475569"
              strokeWidth={2}
              fill="url(#scSlate)"
              name="contributions"
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="1"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#scBlue)"
              name="interest"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginTop: 12, marginBottom: 20, justifyContent: "center" }}>
        {[
          { color: "#475569", label: "Your Contributions" },
          { color: "#2563eb", label: "Interest Earned" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: "inline-block" }} />
            {label}
          </div>
        ))}
      </div>

      {/* Slider */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#180D27" }}>
            Investment Period
          </label>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>
            {years} {years === 1 ? "year" : "years"}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#7c3aed",
            cursor: "pointer",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginTop: 2 }}>
          <span>1 yr</span>
          <span>30 yrs</span>
        </div>
      </div>
    </div>
  )
}
