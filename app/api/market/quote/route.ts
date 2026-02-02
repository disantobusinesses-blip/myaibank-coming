import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - FINNHUB_API_KEY

// Mock quotes
const mockQuotes: Record<string, { price: number; change: number; changePercent: number; high: number; low: number }> = {
  AAPL: { price: 185.42, change: 2.31, changePercent: 1.26, high: 186.10, low: 183.50 },
  GOOGL: { price: 141.80, change: -0.95, changePercent: -0.67, high: 143.20, low: 140.80 },
  MSFT: { price: 378.91, change: 4.23, changePercent: 1.13, high: 380.00, low: 375.50 },
  AMZN: { price: 178.25, change: 1.87, changePercent: 1.06, high: 179.00, low: 176.80 },
  TSLA: { price: 248.50, change: -3.42, changePercent: -1.36, high: 252.00, low: 247.00 },
  SPY: { price: 478.32, change: 2.15, changePercent: 0.45, high: 479.50, low: 476.80 },
  QQQ: { price: 405.67, change: 3.21, changePercent: 0.80, high: 407.00, low: 403.50 },
  VTI: { price: 242.18, change: 1.05, changePercent: 0.44, high: 243.00, low: 241.00 },
  "BTC-USD": { price: 43250.00, change: 1250.00, changePercent: 2.98, high: 43800.00, low: 42000.00 },
  "ETH-USD": { price: 2280.50, change: 45.30, changePercent: 2.03, high: 2310.00, low: 2240.00 },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")?.toUpperCase()

    if (!symbol) {
      return NextResponse.json(
        { ok: false, error: "Symbol is required" },
        { status: 400 }
      )
    }

    // In production, this would call Finnhub API
    // const response = await fetch(
    //   `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    // )

    const quote = mockQuotes[symbol]

    if (!quote) {
      // Generate random quote for unknown symbols
      const price = Math.random() * 500 + 50
      const change = (Math.random() - 0.5) * 10
      return NextResponse.json({
        ok: true,
        symbol,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(((change / price) * 100).toFixed(2)),
        high: parseFloat((price * 1.02).toFixed(2)),
        low: parseFloat((price * 0.98).toFixed(2)),
      })
    }

    return NextResponse.json({
      ok: true,
      symbol,
      ...quote,
    })
  } catch (error) {
    console.error("Error fetching quote:", error)
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
