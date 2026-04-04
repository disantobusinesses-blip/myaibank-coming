import { NextRequest, NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Mock prices for demo mode
const mockPrices: Record<string, number> = {
  // Stocks
  "AAPL": 175.50,
  "MSFT": 378.25,
  "GOOGL": 141.80,
  "TSLA": 242.50,
  
  // ETFs
  "VTS": 285.50,
  "SPY": 478.30,
  "VGS": 102.45,
  
  // Crypto (with exchange prefix)
  "BINANCE:BTCUSDT": 45250.00,
  "BINANCE:ETHUSDT": 2380.50,
  "BINANCE:SOLUSDT": 102.75,
  
  // Crypto (without prefix)
  "BTC": 45250.00,
  "ETH": 2380.50,
  "SOL": 102.75,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerSymbol = searchParams.get("providerSymbol") || "";
    const assetClass = searchParams.get("assetClass") || "stock";

    if (!providerSymbol) {
      return NextResponse.json({ ok: false, error: "Missing providerSymbol" }, { status: 400 });
    }

    // Demo mode - return mock price
    if (!FINNHUB_API_KEY) {
      const price = mockPrices[providerSymbol] || mockPrices[providerSymbol.split(":")[1]] || 100.0;
      return NextResponse.json({ ok: true, quote: { price } });
    }

    // Production mode - call Finnhub API
    if (assetClass === "crypto") {
      // Crypto uses candle endpoint (get latest close price)
      const to = Math.floor(Date.now() / 1000);
      const from = to - 86400; // 24 hours ago
      
      const response = await fetch(
        `https://finnhub.io/api/v1/crypto/candle?symbol=${encodeURIComponent(providerSymbol)}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        return NextResponse.json({ ok: false, error: "Finnhub API error" }, { status: 500 });
      }

      const data = await response.json();
      
      if (data.s === "no_data" || !data.c || data.c.length === 0) {
        return NextResponse.json({ ok: false, error: "No price data available" }, { status: 404 });
      }

      const price = data.c[data.c.length - 1]; // Latest close price
      return NextResponse.json({ ok: true, quote: { price } });
      
    } else {
      // Stock/ETF uses quote endpoint
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(providerSymbol)}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        return NextResponse.json({ ok: false, error: "Finnhub API error" }, { status: 500 });
      }

      const data = await response.json();
      
      if (!data.c || data.c === 0) {
        return NextResponse.json({ ok: false, error: "No price data available" }, { status: 404 });
      }

      const price = data.c; // Current price
      return NextResponse.json({ ok: true, quote: { price } });
    }
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}