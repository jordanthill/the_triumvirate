import Link from "next/link";
import sampleHealthData from "./sample-health-data.json";

interface HealthRecord {
  date: string;
  restingHeartRate: number;
  activeCalories: number;
  sleepHours: number;
  steps: number;
}

interface MonthlyMetric {
  month: string;
  rhr: number;
  calories: number;
}

const records = (sampleHealthData as HealthRecord[]).toSorted((a, b) => a.date.localeCompare(b.date));
const latest = records.at(-1);
const last30 = records.slice(-30);
const previous30 = records.slice(-60, -30);
const last56 = records.slice(-56);

const roadmap = [
  "Replace sample JSON with parsed Apple Health XML export pipeline.",
  "Add per-metric filters, anomaly detection, and rolling baselines.",
  "Ship correlation + regression module with diagnostics and confidence bands.",
  "Generate explainable insight cards with effect sizes and sample size.",
];

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentDelta(value: number, baseline: number): number {
  if (!baseline) return 0;
  return ((value - baseline) / baseline) * 100;
}

function formatSignedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function monthLabel(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleString("en-US", { month: "short" });
}

function buildMonthlyMetrics(data: HealthRecord[]): MonthlyMetric[] {
  const buckets = new Map<string, HealthRecord[]>();

  for (const row of data) {
    const key = row.date.slice(0, 7);
    const values = buckets.get(key) ?? [];
    values.push(row);
    buckets.set(key, values);
  }

  return Array.from(buckets.entries()).map(([month, rows]) => ({
    month: monthLabel(`${month}-01`),
    rhr: Math.round(mean(rows.map((row) => row.restingHeartRate))),
    calories: Math.round(mean(rows.map((row) => row.activeCalories))),
  }));
}

function buildWeeklyRhr(values: HealthRecord[]): number[] {
  const weekly: number[] = [];
  for (let i = 0; i < values.length; i += 7) {
    const block = values.slice(i, i + 7);
    weekly.push(Math.round(mean(block.map((entry) => entry.restingHeartRate))));
  }
  return weekly;
}

function TinyTrend({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 280;
  const height = 90;

  const points = values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
      <defs>
        <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="url(#lineGlow)" strokeWidth="4" strokeLinecap="round" />
      <polyline points={points} fill="none" stroke="#ffffff33" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function HealthProjectPage() {
  if (!latest || records.length === 0) {
    return (
      <div className="space-y-6">
        <Link href="/jordan" className="text-gray-500 hover:text-white transition-colors text-sm">
          &larr; Back
        </Link>
        <p className="text-gray-400">No health data found.</p>
      </div>
    );
  }

  const latestRhr = latest.restingHeartRate;
  const rhr30 = mean(last30.map((row) => row.restingHeartRate));
  const calories30 = mean(last30.map((row) => row.activeCalories));
  const caloriesPrev30 = mean((previous30.length ? previous30 : last30).map((row) => row.activeCalories));
  const sleepConsistency =
    (last30.filter((row) => row.sleepHours >= 7 && row.sleepHours <= 8.5).length / Math.max(last30.length, 1)) * 100;

  const insightCards = [
    {
      title: "Resting Heart Rate",
      value: `${latestRhr.toFixed(0)} bpm`,
      delta: `${formatSignedPercent(percentDelta(latestRhr, rhr30))} vs 30d avg`,
      tone: latestRhr <= rhr30 ? "text-emerald-300" : "text-amber-300",
    },
    {
      title: "Active Calories",
      value: `${Math.round(calories30)} kcal/day`,
      delta: `${formatSignedPercent(percentDelta(calories30, caloriesPrev30))} vs prior 30d`,
      tone: "text-cyan-300",
    },
    {
      title: "Sleep Consistency",
      value: `${Math.round(sleepConsistency)}%`,
      delta: "Share of nights between 7h and 8.5h",
      tone: "text-violet-300",
    },
  ];

  const monthlyTrend = buildMonthlyMetrics(records);
  const monthlyMaxCalories = Math.max(...monthlyTrend.map((item) => item.calories), 1);
  const trendValues = last56.map((row) => row.restingHeartRate);
  const weeklyRhr = buildWeeklyRhr(last56);
  const dateRange = `${records[0].date} to ${latest.date}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/jordan" className="text-gray-500 hover:text-white transition-colors text-sm">
          &larr; Back
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Apple Health Analytics Dashboard</h1>
      </div>

      <section className="rounded-2xl glass overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-emerald-500/10 border-b border-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">Jordan Project</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Personal Health Data, Made Legible</h2>
          <p className="text-gray-300 mt-3 max-w-3xl leading-relaxed">
            The dashboard now renders from a structured JSON dataset that mirrors Apple Health metrics. Next step is
            plugging in direct export parsing.
          </p>
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            <span className="px-2.5 py-1 rounded-full border border-emerald-400/30 text-emerald-300 bg-emerald-500/10">Status: Data-driven MVP</span>
            <span className="px-2.5 py-1 rounded-full border border-blue-400/30 text-blue-300 bg-blue-500/10">Source: sample-health-data.json</span>
            <span className="px-2.5 py-1 rounded-full border border-violet-400/30 text-violet-300 bg-violet-500/10">Range: {dateRange}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {insightCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
              <p className={`text-sm mt-1 ${card.tone}`}>{card.delta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-2xl glass p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Resting Heart Rate Trend</h3>
            <span className="text-xs text-gray-500">Last {trendValues.length} days</span>
          </div>
          <TinyTrend values={trendValues} />
          <div className="grid grid-cols-4 gap-2 pt-2">
            {weeklyRhr.map((value, idx) => (
              <div
                key={`${value}-${idx}`}
                className="h-12 rounded-lg bg-gradient-to-t from-cyan-500/10 to-indigo-500/20 border border-white/5 flex items-end justify-center pb-1"
              >
                <span className="text-[10px] text-gray-400">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl glass p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Monthly KPI Snapshot</h3>
            <span className="text-xs text-gray-500">Computed from sample data</span>
          </div>
          <div className="space-y-3">
            {monthlyTrend.map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{item.month}</span>
                  <span>RHR {item.rhr} bpm</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                    style={{ width: `${(item.calories / monthlyMaxCalories) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500">{item.calories} avg active calories/day</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl glass p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold text-white">Roadmap</h3>
        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
          {roadmap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://github.com/jordanthill/the_triumvirate"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View Repo
          </a>
          <Link href="/jordan" className="px-4 py-2 rounded-full glass glass-hover text-sm text-gray-300 font-medium transition-all">
            Back to Jordan
          </Link>
        </div>
      </section>
    </div>
  );
}
