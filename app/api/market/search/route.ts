import { NextRequest, NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

type SearchResult = {
  provider: "finnhub";
  assetClass: "stock" | "etf" | "crypto";
  symbol: string;
  providerSymbol: string;
  name: string;
};

// Mock data for demo mode
const mockSearchData: Record<string, SearchResult[]> = {
  stock: [
    { provider: "finnhub", assetClass: "stock", symbol: "AAPL", providerSymbol: "AAPL", name: "Apple Inc." },
    { provider: "finnhub", assetClass: "stock", symbol: "MSFT", providerSymbol: "MSFT", name: "Microsoft Corporation" },
    { provider: "finnhub", assetClass: "stock", symbol: "GOOGL", providerSymbol: "GOOGL", name: "Alphabet Inc." },
    { provider: "finnhub", assetClass: "stock", symbol: "TSLA", providerSymbol: "TSLA", name: "Tesla Inc." },
  ],
  etf: [
    { provider: "finnhub", assetClass: "etf", symbol: "VTS", providerSymbol: "VTS", name: "Vanguard US Total Market Shares Index ETF" },
    { provider: "finnhub", assetClass: "etf", symbol: "SPY", providerSymbol: "SPY", name: "SPDR S&P 500 ETF Trust" },
    { provider: "finnhub", assetClass: "etf", symbol: "VGS", providerSymbol: "VGS", name: "Vanguard MSCI Index International Shares ETF" },
  ],
  crypto: [
    { provider: "finnhub", assetClass: "crypto", symbol: "BTC", providerSymbol: "BINANCE:BTCUSDT", name: "Bitcoin" },
    { provider: "finnhub", assetClass: "crypto", symbol: "ETH", providerSymbol: "BINANCE:ETHUSDT", name: "Ethereum" },
    { provider: "finnhub", assetClass: "crypto", symbol: "SOL", providerSymbol: "BINANCE:SOLUSDT", name: "Solana" },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const assetClass = searchParams.get("assetClass") || "stock";

    if (!q || q.length < 1) {
      return NextResponse.json({ ok: false, error: "Query too short" }, { status: 400 });
    }

    // Demo mode - return mock data
    if (!FINNHUB_API_KEY) {
      const mockResults = mockSearchData[assetClass] || mockSearchData.stock;
      const filtered = mockResults.filter(
        (r) =>
          r.symbol.toLowerCase().includes(q.toLowerCase()) ||
          r.name.toLowerCase().includes(q.toLowerCase())
      );
      return NextResponse.json({ ok: true, results: filtered });
    }

    // Production mode - call Finnhub API
    if (assetClass === "crypto") {
      // Crypto requires listing all symbols then filtering
      const response = await fetch(
        `https://finnhub.io/api/v1/crypto/symbol?exchange=binance&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        return NextResponse.json({ ok: false, error: "Finnhub API error" }, { status: 500 });
      }

      const data = await response.json();
      const results: SearchResult[] = (data || [])
        .filter((item: any) => {
          const symbol = item.displaySymbol || item.symbol || "";
          const desc = item.description || "";
          return (
            symbol.toLowerCase().includes(q.toLowerCase()) ||
            desc.toLowerCase().includes(q.toLowerCase())
          );
        })
        .slice(0, 10)
        .map((item: any) => ({
          provider: "finnhub" as const,
          assetClass: "crypto" as const,
          symbol: item.displaySymbol || item.symbol,
          providerSymbol: item.symbol,
          name: item.description || item.displaySymbol || item.symbol,
        }));

      return NextResponse.json({ ok: true, results });
    } else {
      // Stock/ETF search
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        return NextResponse.json({ ok: false, error: "Finnhub API error" }, { status: 500 });
      }

      const data = await response.json();
      const results: SearchResult[] = ((data && data.result) || [])
        .slice(0, 10)
        .map((item: any) => ({
          provider: "finnhub" as const,
          assetClass: (assetClass as "stock" | "etf") || "stock",
          symbol: item.symbol,
          providerSymbol: item.symbol,
          name: item.description || item.symbol,
        }));

      return NextResponse.json({ ok: true, results });
    }
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}