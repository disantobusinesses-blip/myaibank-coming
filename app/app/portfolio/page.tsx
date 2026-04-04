"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Plus, 
  Star,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react"
import { PortfolioChart } from "@/components/portfolio/portfolio-chart"
import { StockSearchModal } from "@/components/portfolio/stock-search-modal"
import { HoldingCard } from "@/components/portfolio/holding-card"

// Mock portfolio data
const mockHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 10, avgPrice: 175.50, currentPrice: 182.30, change: 3.88 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, avgPrice: 140.20, currentPrice: 148.75, change: 6.10 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 8, avgPrice: 365.00, currentPrice: 378.50, change: 3.70 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 3, avgPrice: 245.00, currentPrice: 238.20, change: -2.78 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 12, avgPrice: 178.90, currentPrice: 185.40, change: 3.63 },
]

const mockWatchlist = [
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.50, change: 4.25 },
  { symbol: "META", name: "Meta Platforms", price: 505.30, change: -1.20 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 165.80, change: 2.10 },
]

export default function PortfolioPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [holdings] = useState(mockHoldings)
  const [watchlist] = useState(mockWatchlist)

  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = (totalGain / totalCost) * 100

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground text-sm">Track your investments and watchlist</p>
        </div>
        <Button 
          onClick={() => setSearchOpen(true)}
          className="bg-[#1F0051] hover:bg-[#1F0051]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F0051]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#1F0051]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold text-foreground">
                  ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                totalGain >= 0 ? "bg-[#22c55e]/20" : "bg-destructive/20"
              }`}>
                {totalGain >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-[#22c55e]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Gain/Loss</p>
                <p className={`text-xl font-bold ${totalGain >= 0 ? "text-[#22c55e]" : "text-destructive"}`}>
                  {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#14b8a6]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Return</p>
                <p className={`text-xl font-bold ${totalGainPercent >= 0 ? "text-[#22c55e]" : "text-destructive"}`}>
                  {totalGainPercent >= 0 ? "+" : ""}{totalGainPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Holdings</p>
                <p className="text-xl font-bold text-foreground">{holdings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioChart />
        </CardContent>
      </Card>

      {/* Holdings & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Holdings</h2>
          <div className="space-y-3">
            {holdings.map((holding) => (
              <HoldingCard key={holding.symbol} holding={holding} />
            ))}
          </div>
        </div>

        {/* Watchlist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Watchlist</h2>
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {watchlist.map((stock) => (
              <Card key={stock.symbol} className="bg-card border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#f59e0b]" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground text-sm">${stock.price.toFixed(2)}</p>
                      <div className={`flex items-center justify-end gap-1 text-xs ${
                        stock.change >= 0 ? "text-[#22c55e]" : "text-destructive"
                      }`}>
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Search Modal */}
      <StockSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
