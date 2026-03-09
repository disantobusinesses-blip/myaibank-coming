"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
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
 * Forecast Area Chart — inspired by the Bklit area-chart component
 * from https://21st.dev/community/components/Bklit/area-chart/default
 *
 * Uses the existing recharts + shadcn ChartContainer infrastructure
 * with the Bklit visual style: gradient fills, dashed grid lines,
 * smooth monotone curve, and clean axis labels.
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

function generateForecastData() {
  const data = []
  const today = new Date()

  for (let i = 0; i < 6; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1)

    const baseIncome = 4200 + Math.sin(i * 0.8) * 1200
    const baseExpenses = 2800 + Math.cos(i * 0.6) * 900

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      income: Math.round(baseIncome + ((i * 13) % 7) * 100),
      expenses: Math.round(baseExpenses + ((i * 11) % 5) * 80),
    })
  }

  return data
}

export function ForecastAreaChart() {
  const data = useMemo(() => generateForecastData(), [])

  return (
    <div className="rounded-2xl bg-card border border-border p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Forecast Overview
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Projected income vs expenses over the next 6 months
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-48 lg:h-64 w-full">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="forecastIncome" x1="0" y1="0" x2="0" y2="1">
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
            <linearGradient id="forecastExpenses" x1="0" y1="0" x2="0" y2="1">
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
            horizontal={true}
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
            tick={{ fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="var(--color-income)"
            strokeWidth={2}
            fill="url(#forecastIncome)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            strokeWidth={2}
            fill="url(#forecastExpenses)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>

      <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-sm">
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
      </div>
    </div>
  )
}
