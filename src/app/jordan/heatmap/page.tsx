"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface Stock {
  ticker: string;
  name: string;
  sector: string;
  marketCap: number; // billions, used for block sizing
  price: number;
  change: number; // percent change
  history: number[];
}

interface Sector {
  name: string;
  stocks: Stock[];
}

const INITIAL_STOCKS: Omit<Stock, "change" | "history">[] = [
  // Technology
  { ticker: "AAPL", name: "Apple", sector: "Technology", marketCap: 3400, price: 232.5 },
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", marketCap: 3100, price: 418.2 },
  { ticker: "NVDA", name: "NVIDIA", sector: "Technology", marketCap: 2900, price: 875.4 },
  { ticker: "GOOG", name: "Alphabet", sector: "Technology", marketCap: 2100, price: 176.3 },
  { ticker: "META", name: "Meta", sector: "Technology", marketCap: 1500, price: 585.1 },
  { ticker: "AVGO", name: "Broadcom", sector: "Technology", marketCap: 800, price: 186.7 },
  { ticker: "ORCL", name: "Oracle", sector: "Technology", marketCap: 450, price: 178.2 },
  { ticker: "CRM", name: "Salesforce", sector: "Technology", marketCap: 270, price: 282.9 },
  // Healthcare
  { ticker: "UNH", name: "UnitedHealth", sector: "Healthcare", marketCap: 540, price: 582.1 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", marketCap: 380, price: 158.4 },
  { ticker: "LLY", name: "Eli Lilly", sector: "Healthcare", marketCap: 750, price: 790.2 },
  { ticker: "PFE", name: "Pfizer", sector: "Healthcare", marketCap: 150, price: 26.8 },
  { ticker: "ABBV", name: "AbbVie", sector: "Healthcare", marketCap: 310, price: 175.6 },
  { ticker: "MRK", name: "Merck", sector: "Healthcare", marketCap: 280, price: 110.5 },
  // Finance
  { ticker: "BRK.B", name: "Berkshire", sector: "Finance", marketCap: 880, price: 410.3 },
  { ticker: "JPM", name: "JPMorgan", sector: "Finance", marketCap: 620, price: 213.7 },
  { ticker: "V", name: "Visa", sector: "Finance", marketCap: 580, price: 285.4 },
  { ticker: "MA", name: "Mastercard", sector: "Finance", marketCap: 430, price: 470.8 },
  { ticker: "BAC", name: "Bank of America", sector: "Finance", marketCap: 310, price: 39.2 },
  { ticker: "GS", name: "Goldman Sachs", sector: "Finance", marketCap: 160, price: 480.5 },
  // Consumer
  { ticker: "AMZN", name: "Amazon", sector: "Consumer", marketCap: 2000, price: 192.8 },
  { ticker: "TSLA", name: "Tesla", sector: "Consumer", marketCap: 800, price: 248.5 },
  { ticker: "WMT", name: "Walmart", sector: "Consumer", marketCap: 520, price: 65.3 },
  { ticker: "HD", name: "Home Depot", sector: "Consumer", marketCap: 380, price: 370.1 },
  { ticker: "COST", name: "Costco", sector: "Consumer", marketCap: 350, price: 790.4 },
  { ticker: "NKE", name: "Nike", sector: "Consumer", marketCap: 120, price: 78.2 },
  // Energy
  { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", marketCap: 460, price: 109.5 },
  { ticker: "CVX", name: "Chevron", sector: "Energy", marketCap: 280, price: 152.3 },
  { ticker: "COP", name: "ConocoPhillips", sector: "Energy", marketCap: 130, price: 108.7 },
  { ticker: "SLB", name: "Schlumberger", sector: "Energy", marketCap: 65, price: 45.8 },
  // Industrials
  { ticker: "CAT", name: "Caterpillar", sector: "Industrials", marketCap: 180, price: 365.2 },
  { ticker: "GE", name: "GE Aerospace", sector: "Industrials", marketCap: 200, price: 185.6 },
  { ticker: "UNP", name: "Union Pacific", sector: "Industrials", marketCap: 150, price: 245.3 },
  { ticker: "HON", name: "Honeywell", sector: "Industrials", marketCap: 140, price: 212.8 },
  { ticker: "BA", name: "Boeing", sector: "Industrials", marketCap: 130, price: 178.4 },
];

function generateChange(volatility: number): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * volatility;
}

function getColor(change: number): string {
  if (change > 3) return "bg-emerald-400";
  if (change > 2) return "bg-emerald-500";
  if (change > 1) return "bg-emerald-600";
  if (change > 0.25) return "bg-emerald-700/80";
  if (change > -0.25) return "bg-gray-700";
  if (change > -1) return "bg-red-700/80";
  if (change > -2) return "bg-red-600";
  if (change > -3) return "bg-red-500";
  return "bg-red-400";
}

function getTextColor(change: number): string {
  if (Math.abs(change) > 2) return "text-white";
  if (Math.abs(change) > 0.25) return "text-gray-200";
  return "text-gray-400";
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#34d399" : "#f87171"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function HeatmapPage() {
  const [stocks, setStocks] = useState<Stock[]>(() =>
    INITIAL_STOCKS.map((s) => ({
      ...s,
      change: generateChange(1.2),
      history: [s.price],
    }))
  );
  const [selected, setSelected] = useState<Stock | null>(null);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setStocks((prev) =>
      prev.map((s) => {
        const volatility = s.sector === "Technology" ? 1.5 : s.sector === "Energy" ? 1.8 : 1.1;
        const delta = generateChange(volatility);
        const newPrice = Math.max(1, s.price * (1 + delta / 100));
        const newChange = ((newPrice - s.history[0]) / s.history[0]) * 100;
        const newHistory = [...s.history, newPrice].slice(-60);
        return { ...s, price: newPrice, change: newChange, history: newHistory };
      })
    );
  }, []);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(tick, 2000 / speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick, speed, paused]);

  // Group by sector
  const sectors: Sector[] = [];
  const sectorMap = new Map<string, Stock[]>();
  for (const s of stocks) {
    if (!sectorMap.has(s.sector)) sectorMap.set(s.sector, []);
    sectorMap.get(s.sector)!.push(s);
  }
  for (const [name, sectorStocks] of sectorMap) {
    sectors.push({ name, stocks: sectorStocks });
  }

  const totalMarketCap = stocks.reduce((sum, s) => sum + s.marketCap, 0);
  const avgChange =
    stocks.reduce((sum, s) => sum + s.change * s.marketCap, 0) / totalMarketCap;

  // Update selected stock reference if it exists
  const selectedStock = selected ? stocks.find((s) => s.ticker === selected.ticker) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/jordan"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Market Heatmap</h1>
        <div
          className={`ml-2 h-2 w-2 rounded-full ${
            paused ? "bg-gray-500" : "bg-emerald-400 animate-pulse"
          }`}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Market:</span>
          <span
            className={`text-sm font-semibold ${
              avgChange >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-gray-500 mr-1">Speed:</span>
          {([1, 2, 5] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                speed === s
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          className="px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          {paused ? "Resume" : "Pause"}
        </button>

        <button
          onClick={() =>
            setStocks((prev) =>
              prev.map((s) => ({
                ...s,
                price: INITIAL_STOCKS.find((i) => i.ticker === s.ticker)!.price,
                change: 0,
                history: [INITIAL_STOCKS.find((i) => i.ticker === s.ticker)!.price],
              }))
            )
          }
          className="px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 justify-center">
        <span className="text-xs text-gray-500 mr-2">Legend:</span>
        {[
          { label: "-3%+", cls: "bg-red-400" },
          { label: "-2%", cls: "bg-red-500" },
          { label: "-1%", cls: "bg-red-600" },
          { label: "0%", cls: "bg-gray-700" },
          { label: "+1%", cls: "bg-emerald-700/80" },
          { label: "+2%", cls: "bg-emerald-500" },
          { label: "+3%+", cls: "bg-emerald-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`w-4 h-3 rounded-sm ${item.cls}`} />
            <span className="text-[10px] text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid by sector */}
      <div className="space-y-3">
        {sectors.map((sector) => {
          const sectorCap = sector.stocks.reduce((s, st) => s + st.marketCap, 0);
          const sectorAvg =
            sector.stocks.reduce((s, st) => s + st.change * st.marketCap, 0) / sectorCap;
          return (
            <div key={sector.name}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-gray-400">{sector.name}</span>
                <span
                  className={`text-xs font-medium ${
                    sectorAvg >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {sectorAvg >= 0 ? "+" : ""}
                  {sectorAvg.toFixed(2)}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sector.stocks
                  .sort((a, b) => b.marketCap - a.marketCap)
                  .map((stock) => {
                    // Size based on relative market cap within the whole market
                    const relSize = stock.marketCap / totalMarketCap;
                    const minW = 70;
                    const maxW = 200;
                    const w = Math.max(minW, Math.min(maxW, relSize * 3000));
                    const h = Math.max(50, w * 0.55);

                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => setSelected(stock)}
                        className={`${getColor(
                          stock.change
                        )} rounded-lg p-2 flex flex-col items-center justify-center transition-all duration-300 hover:brightness-125 hover:scale-[1.02] border border-white/5`}
                        style={{ width: w, height: h }}
                      >
                        <span
                          className={`font-bold text-xs sm:text-sm ${getTextColor(stock.change)}`}
                        >
                          {stock.ticker}
                        </span>
                        <span
                          className={`text-[10px] sm:text-xs font-medium ${getTextColor(
                            stock.change
                          )}`}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)}%
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock detail panel */}
      {selectedStock && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedStock.ticker}</h3>
                <span className="text-sm text-gray-400">{selectedStock.name}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-bold text-white">
                  ${selectedStock.price.toFixed(2)}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    selectedStock.change >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {selectedStock.change >= 0 ? "+" : ""}
                  {selectedStock.change.toFixed(2)}%
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-white transition-colors text-lg"
            >
              &times;
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Sector: {selectedStock.sector}</span>
            <span>Market Cap: ${selectedStock.marketCap}B</span>
          </div>
          <div className="pt-2">
            <Sparkline
              data={selectedStock.history}
              positive={selectedStock.change >= 0}
            />
            <span className="text-[10px] text-gray-600 ml-1">
              {selectedStock.history.length} ticks
            </span>
          </div>
        </div>
      )}

      <p className="text-center text-gray-600 text-xs">
        Simulated data &mdash; prices update in real-time using random walk. Not financial advice.
      </p>
    </div>
  );
}
