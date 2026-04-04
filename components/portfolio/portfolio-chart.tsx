"use client"

import { useState } from "react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { Button } from "@/components/ui/button"

// Generate mock portfolio history data
function generatePortfolioData(days: number) {
  const data = []
  let value = 15000
  const today = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Random daily change between -3% and +4%
    const change = (Math.random() * 7 - 3) / 100
    value = value * (1 + change)
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value * 100) / 100,
    })
  }
  
  return data
}

const timeRanges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "All", days: 730 },
]

export function PortfolioChart() {
  const [selectedRange, setSelectedRange] = useState("1M")
  const days = timeRanges.find(r => r.label === selectedRange)?.days || 30
  const data = generatePortfolioData(days)
  
  const startValue = data[0]?.value || 0
  const endValue = data[data.length - 1]?.value || 0
  const isPositive = endValue >= startValue

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.label}
            variant={selectedRange === range.label ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedRange(range.label)}
            className={selectedRange === range.label 
              ? "bg-[#1F0051] hover:bg-[#1F0051]/90 text-white" 
              : "text-muted-foreground hover:text-foreground"
            }
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#22c55e" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#22c55e" : "#ef4444"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#8b8b9a" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#8b8b9a" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['dataMin - 500', 'dataMax + 500']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d0d12",
                border: "1px solid #1f1f2e",
                borderRadius: "12px",
                padding: "12px",
              }}
              labelStyle={{ color: "#8b8b9a", marginBottom: "4px" }}
              formatter={(value: number) => [
                `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                "Portfolio Value"
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
