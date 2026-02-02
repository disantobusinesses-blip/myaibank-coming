import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - FINNHUB_API_KEY

// Mock search results
const mockResults = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "etf", exchange: "NYSE" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf", exchange: "NASDAQ" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", type: "etf", exchange: "NYSE" },
  { symbol: "BTC-USD", name: "Bitcoin USD", type: "crypto", exchange: "Crypto" },
  { symbol: "ETH-USD", name: "Ethereum USD", type: "crypto", exchange: "Crypto" },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const assetClass = searchParams.get("assetClass")

    // In production, this would call Finnhub API
    // const response = await fetch(
    //   `https://finnhub.io/api/v1/search?q=${query}&token=${process.env.FINNHUB_API_KEY}`
    // )

    let results = mockResults.filter(
      (r) =>
        r.symbol.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query)
    )

    if (assetClass) {
      results = results.filter((r) => r.type === assetClass)
    }

    return NextResponse.json({
      ok: true,
      results: results.slice(0, 10),
    })
  } catch (error) {
    console.error("Error searching market:", error)
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
