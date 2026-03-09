"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * Unified Cashflow Forecast Chart
 *
 * Combines historical actuals with a 6-month forward forecast in a single
 * Bklit-inspired area chart.  A vertical "Today" marker is rendered at the
 * data point whose normalised date matches the user's current local date.
 *
 * How the "Today" marker works:
 * 1. Each data point stores a `rawDate` string in YYYY-MM-DD format.
 * 2. The user's current local date is normalised to the same YYYY-MM-DD
 *    format via `toISOString().slice(0, 10)` on a midnight-local Date.
 * 3. The point whose `rawDate === todayStr` is flagged `isToday: true`.
 * 4. A Recharts `<ReferenceLine>` is placed at that point's `date` label
 *    to draw the vertical line + "Today" label.
 */

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1, #8b5cf6)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2, #06b6d4)",
  },
} satisfies ChartConfig

/** Normalise a Date to a YYYY-MM-DD string using the local timezone. */
function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

interface ForecastDataPoint {
  /** Display label, e.g. "Mar 9" */
  date: string
  /** ISO-like key for date matching, e.g. "2026-03-09" */
  rawDate: string
  /** Projected income for the period */
  income: number
  /** Projected expenses for the period */
  expenses: number
  /** true when this point is the user's current local date */
  isToday: boolean
  /** true for dates after today (forecast territory) */
  isFuture: boolean
}

/**
 * Generate forecast data spanning 3 months in the past through 6 months
 * into the future.  Data is generated at weekly intervals so the chart
 * is not too cluttered while still giving a clear timeline.
 */
function generateForecastData(): {
  data: ForecastDataPoint[]
  todayLabel: string
  projectedIncome: number
  projectedExpenses: number
  projectedDate: string
} {
  const data: ForecastDataPoint[] = []
  const today = new Date()
  const todayStr = toDateKey(today)

  // ~3 months back = -12 weeks, ~6 months forward = +26 weeks ≈ 39 total
  const weeksBack = 12
  const weeksForward = 26
  let todayLabel = ""

  for (let w = -weeksBack; w <= weeksForward; w++) {
    const d = new Date(today)
    d.setDate(d.getDate() + w * 7)
    const key = toDateKey(d)
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    const isToday = key === todayStr
    const isFuture = key > todayStr

    // Deterministic-ish mock values so the chart looks natural.
    // Income has a gentle upward trend; expenses fluctuate.
    const weekIndex = w + weeksBack // 0-based index
    const baseIncome = 4200 + Math.sin(weekIndex * 0.25) * 800
    const baseExpenses = 2800 + Math.cos(weekIndex * 0.35) * 600

    data.push({
      date: label,
      rawDate: key,
      income: Math.round(baseIncome + ((weekIndex * 13) % 7) * 60),
      expenses: Math.round(baseExpenses + ((weekIndex * 11) % 5) * 50),
      isToday,
      isFuture,
    })

    if (isToday) {
      todayLabel = label
    }
  }

  // If today didn't land exactly on a generated weekly point, find the
  // closest point and override it to represent today.
  if (!todayLabel && data.length > 0) {
    let closest = data[0]
    let minDiff = Math.abs(
      new Date(data[0].rawDate).getTime() - today.getTime()
    )
    for (const pt of data) {
      const diff = Math.abs(new Date(pt.rawDate).getTime() - today.getTime())
      if (diff < minDiff) {
        minDiff = diff
        closest = pt
      }
    }
    closest.isToday = true
    closest.rawDate = todayStr
    closest.date = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    todayLabel = closest.date
    // Recalculate isFuture for all points based on updated today position
    for (const pt of data) {
      pt.isFuture = pt.rawDate > todayStr
    }
  }

  const lastPoint = data[data.length - 1]

  return {
    data,
    todayLabel,
    projectedIncome: lastPoint?.income ?? 0,
    projectedExpenses: lastPoint?.expenses ?? 0,
    projectedDate: lastPoint?.date ?? "",
  }
}

export function CashflowChart() {
  const { data, todayLabel, projectedIncome, projectedExpenses, projectedDate } =
    useMemo(() => generateForecastData(), [])

  const netProjected = projectedIncome - projectedExpenses

  return (
    <div className="rounded-2xl bg-card border border-border p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Cashflow Forecast
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Historical &amp; projected income vs expenses — 6 month outlook
        </p>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-48 lg:h-64 w-full">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="cfIncome" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-income)"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="var(--color-income)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="cfExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-expenses)"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="var(--color-expenses)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            horizontal
            vertical={false}
            strokeDasharray="4 4"
            stroke="var(--border)"
            strokeOpacity={0.5}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 10 }}
            tickFormatter={(value: number) =>
              `$${(value / 1000).toFixed(1)}k`
            }
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />

          {/* Today marker — vertical reference line */}
          {todayLabel && (
            <ReferenceLine
              x={todayLabel}
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: "Today",
                position: "top",
                fill: "#8b5cf6",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          )}

          {/* Income area */}
          <Area
            type="monotone"
            dataKey="income"
            stroke="var(--color-income)"
            strokeWidth={2}
            fill="url(#cfIncome)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />

          {/* Expenses area */}
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            strokeWidth={2}
            fill="url(#cfExpenses)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>

      {/* Legend + Projected summary */}
      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: "var(--chart-1, #8b5cf6)" }}
            />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: "var(--chart-2, #06b6d4)" }}
            />
            <span className="text-muted-foreground">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-[#8b5cf6]" style={{ width: 12 }} />
            <span className="text-muted-foreground">Today</span>
          </div>
        </div>

        {/* Projected net cashflow */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Projected Net · {projectedDate}
          </p>
          <p
            className={`text-xl font-bold ${
              netProjected >= 0 ? "text-[#22c55e]" : "text-destructive"
            }`}
          >
            {netProjected >= 0 ? "+" : "−"}${Math.abs(netProjected).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {netProjected >= 0 ? "Surplus" : "Deficit"}
          </p>
        </div>
      </div>
    </div>
  )
}
