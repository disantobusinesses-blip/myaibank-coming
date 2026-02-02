"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Loader2 } from "lucide-react"

interface StockSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock search results
const mockSearchResults = [
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", price: 875.50 },
  { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", price: 165.80 },
  { symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ", price: 42.30 },
  { symbol: "TSM", name: "Taiwan Semiconductor", exchange: "NYSE", price: 142.60 },
]

export function StockSearchModal({ open, onOpenChange }: StockSearchModalProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(mockSearchResults)

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.length < 1) {
      setResults(mockSearchResults)
      return
    }

    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Filter mock results
    const filtered = mockSearchResults.filter(
      r => r.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setResults(filtered)
    setLoading(false)
  }

  const handleAddStock = (symbol: string) => {
    // In production, this would add to portfolio or watchlist
    console.log("Adding stock:", symbol)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Search Stocks</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol or name..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Results */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            results.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => handleAddStock(stock.symbol)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1F0051]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#1F0051]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{stock.exchange}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
