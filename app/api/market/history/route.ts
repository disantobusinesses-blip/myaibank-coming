import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - FINNHUB_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const resolution = searchParams.get("resolution") || "D"
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!symbol) {
      return NextResponse.json(
        { ok: false, error: "Symbol is required" },
        { status: 400 }
      )
    }

    // In production, this would call Finnhub API
    // const response = await fetch(
    //   `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`
    // )

    // Generate mock candle data
    const days = 30
    const candles = []
    let basePrice = 150 + Math.random() * 100
    const now = Date.now()

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60 * 1000
      const open = basePrice
      const change = (Math.random() - 0.48) * 5
      const close = open + change
      const high = Math.max(open, close) + Math.random() * 3
      const low = Math.min(open, close) - Math.random() * 3
      const volume = Math.floor(Math.random() * 10000000) + 1000000

      candles.push({
        timestamp,
        date: new Date(timestamp).toISOString().split("T")[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
      })

      basePrice = close
    }

    return NextResponse.json({
      ok: true,
      symbol,
      resolution,
      candles,
    })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
