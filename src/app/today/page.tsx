"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HistoryEvent {
  year: string;
  text: string;
}

interface WikiEvent {
  year: string;
  text: string;
  pages?: { title: string; extract?: string; thumbnail?: { source: string } }[];
}

interface DayData {
  events: HistoryEvent[];
  births: HistoryEvent[];
  deaths: HistoryEvent[];
}

const TABS = ["Events", "Births", "Deaths"] as const;
type Tab = (typeof TABS)[number];

export default function TodayPage() {
  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Events");
  const [expanded, setExpanded] = useState<string | null>(null);

  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" });
  const day = today.getDate();
  const monthNum = String(today.getMonth() + 1).padStart(2, "0");
  const dayNum = String(day).padStart(2, "0");

  useEffect(() => {
    async function fetchHistory() {
      try {
        // Wikipedia "On this day" API
        const res = await fetch(
          `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${monthNum}/${dayNum}`,
          {
            headers: { Accept: "application/json" },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();

        const mapEvents = (arr: WikiEvent[] = []): HistoryEvent[] =>
          arr
            .map((e) => ({
              year: e.year || "???",
              text: e.text,
            }))
            .sort((a, b) => Number(b.year) - Number(a.year));

        setData({
          events: mapEvents(json.events),
          births: mapEvents(json.births),
          deaths: mapEvents(json.deaths),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [monthNum, dayNum]);

  const currentItems: HistoryEvent[] = data
    ? tab === "Events"
      ? data.events
      : tab === "Births"
      ? data.births
      : data.deaths
    : [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Home
        </Link>
        <h1 className="text-2xl font-bold text-white">This Day in History</h1>
      </div>

      {/* Date header */}
      <div className="text-center py-6 glass rounded-2xl">
        <div className="text-4xl font-bold text-white">
          {month} {day}
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s what happened on this day throughout history
        </p>
        {data && (
          <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
            <span>
              <strong className="text-white">{data.events.length}</strong> events
            </span>
            <span>
              <strong className="text-white">{data.births.length}</strong> births
            </span>
            <span>
              <strong className="text-white">{data.deaths.length}</strong> deaths
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}. The Wikipedia API may be temporarily unavailable.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-full p-1 w-fit mx-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl glass animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {currentItems.map((item, i) => {
            const id = `${tab}-${i}`;
            const isExpanded = expanded === id;
            return (
              <button
                key={id}
                onClick={() => setExpanded(isExpanded ? null : id)}
                className="w-full text-left flex gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm font-mono font-bold text-indigo-400 w-12 shrink-0 pt-0.5">
                  {item.year}
                </span>
                <p
                  className={`text-sm text-gray-300 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}
                >
                  {item.text}
                </p>
              </button>
            );
          })}

          {currentItems.length === 0 && (
            <div className="text-center py-12 text-gray-600 text-sm">
              No {tab.toLowerCase()} found for this date.
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-gray-600">
        Data from Wikipedia &middot; Updates daily
      </p>
    </div>
  );
}
