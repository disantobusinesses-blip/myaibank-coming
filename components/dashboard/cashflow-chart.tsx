"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

// Generate mock forecast data
function generateForecastData() {
  const data = []
  const baseValue = 2500
  const today = new Date()
  
  for (let i = -14; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    const variance = Math.sin(i * 0.3) * 800 + Math.random() * 400
    const value = baseValue + variance + (i > 0 ? i * 50 : 0)
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value),
      isFuture: i > 0,
    })
  }
  
  return data
}

export function CashflowChart() {
  const data = useMemo(() => generateForecastData(), [])
  const currentValue = data.find((d) => !d.isFuture && data.indexOf(d) === data.findIndex((x) => x.isFuture) - 1)?.value || 0
  const projectedValue = data[data.length - 1]?.value || 0
  const projectedDate = data[data.length - 1]?.date || ""

  return (
    <div className="rounded-2xl bg-card border border-border p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Cashflow Forecast
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Forecasted cashflow based on recent income and expenses
        </p>
      </div>

      {/* Chart */}
      <div className="h-48 lg:h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8b8b9a", fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8b8b9a", fontSize: 10 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                      <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                      <p className="text-sm font-semibold text-[#22c55e]">
                        ${payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{ r: 4, fill: "#22c55e", stroke: "#0d0d12", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Projected Value Tooltip */}
        <div className="absolute top-4 right-4 bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-lg px-3 py-2">
          <p className="text-lg font-bold text-[#22c55e]">
            ${projectedValue.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-[#22c55e]">{"↓"}</span>
            {projectedDate}
          </p>
        </div>
      </div>

      {/* Projected Cashflow Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Projected Cashflow
        </p>
        <p className="text-3xl font-bold text-foreground mt-1">
          ${projectedValue.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">
          {projectedDate}{" "}
          <span className="text-[#22c55e] font-medium">Surplus</span>
        </p>
      </div>
    </div>
  )
}
