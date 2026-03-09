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
import { useAppData } from "@/contexts/app-data-context"
import { generateForecast } from "@/lib/financial-engine"

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
 *    format via the `toDateKey()` helper in financial-engine.ts.
 * 3. The point whose `rawDate === todayStr` is flagged `isToday: true`.
 * 4. A Recharts `<ReferenceLine>` is placed at that point's `date` label
 *    to draw the vertical line + "Today" label.
 *
 * Data source:
 * - Historical points use actual income/expense aggregates from the user's
 *   real transaction data (via useAppData context).
 * - Future points project forward using computed weekly averages plus
 *   known recurring subscription amounts.
 * - No synthetic or randomly generated data is used.
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

export function CashflowChart() {
  const { transactions, subscriptions } = useAppData()

  const { data, todayLabel, projectedIncome, projectedExpenses, projectedDate } =
    useMemo(
      () => generateForecast(transactions, subscriptions),
      [transactions, subscriptions]
    )

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
            <span className="inline-block w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: "var(--chart-3, #8b5cf6)" }} />
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
              netProjected >= 0 ? "text-green-500" : "text-destructive"
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
