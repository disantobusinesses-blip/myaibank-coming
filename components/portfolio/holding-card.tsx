"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Holding {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  change: number
}

interface HoldingCardProps {
  holding: Holding
}

export function HoldingCard({ holding }: HoldingCardProps) {
  const totalValue = holding.shares * holding.currentPrice
  const totalCost = holding.shares * holding.avgPrice
  const gain = totalValue - totalCost
  const gainPercent = (gain / totalCost) * 100
  const isPositive = gain >= 0

  return (
    <Card className="bg-card border-border hover:bg-secondary/30 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Stock Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F0051] to-[#2d1b69] flex items-center justify-center">
              <span className="text-white font-bold text-sm">{holding.symbol.slice(0, 2)}</span>
            </div>
            
            {/* Stock Info */}
            <div>
              <p className="font-semibold text-foreground">{holding.symbol}</p>
              <p className="text-sm text-muted-foreground">{holding.shares} shares @ ${holding.avgPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Value & Change */}
          <div className="text-right">
            <p className="font-semibold text-foreground">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <div className={`flex items-center justify-end gap-1 text-sm ${
              isPositive ? "text-[#22c55e]" : "text-destructive"
            }`}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>
                {isPositive ? "+" : ""}${Math.abs(gain).toFixed(2)} ({isPositive ? "+" : ""}{gainPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Price Bar */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Current: ${holding.currentPrice.toFixed(2)}</span>
          <span className="text-border">|</span>
          <span className={isPositive ? "text-[#22c55e]" : "text-destructive"}>
            {holding.change >= 0 ? "+" : ""}{holding.change.toFixed(2)}% today
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
