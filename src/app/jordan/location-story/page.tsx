"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import sampleData from "./sample-location-history.json";
import type { TrackPoint } from "./StoryMap";

const StoryMap = dynamic(() => import("./StoryMap"), { ssr: false });

type GoogleLocationRecord = {
  latitudeE7?: number;
  longitudeE7?: number;
  timestampMs?: string;
  timestamp?: string;
};

type GoogleTimelineObject = {
  placeVisit?: {
    location?: { latitudeE7?: number; longitudeE7?: number; name?: string };
    duration?: { startTimestamp?: string };
  };
  activitySegment?: {
    startLocation?: { latitudeE7?: number; longitudeE7?: number };
    duration?: { startTimestamp?: string };
  };
};

function asTrackPoint(raw: unknown): TrackPoint | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const timestamp = item.timestamp;
  const lat = item.lat;
  const lng = item.lng;

  if (typeof timestamp === "string" && typeof lat === "number" && typeof lng === "number") {
    return {
      timestamp,
      lat,
      lng,
      label: typeof item.label === "string" ? item.label : undefined,
    };
  }
  return null;
}

function toPointFromLocationRecord(item: GoogleLocationRecord): TrackPoint | null {
  if (typeof item.latitudeE7 !== "number" || typeof item.longitudeE7 !== "number") return null;
  const timestamp = item.timestamp ?? (item.timestampMs ? new Date(Number(item.timestampMs)).toISOString() : null);
  if (!timestamp) return null;
  return {
    timestamp,
    lat: item.latitudeE7 / 1e7,
    lng: item.longitudeE7 / 1e7,
  };
}

function toPointFromTimelineObject(item: GoogleTimelineObject): TrackPoint | null {
  const place = item.placeVisit?.location;
  const placeTime = item.placeVisit?.duration?.startTimestamp;
  if (place && typeof place.latitudeE7 === "number" && typeof place.longitudeE7 === "number" && placeTime) {
    return {
      timestamp: placeTime,
      lat: place.latitudeE7 / 1e7,
      lng: place.longitudeE7 / 1e7,
      label: place.name,
    };
  }

  const activity = item.activitySegment?.startLocation;
  const activityTime = item.activitySegment?.duration?.startTimestamp;
  if (activity && typeof activity.latitudeE7 === "number" && typeof activity.longitudeE7 === "number" && activityTime) {
    return {
      timestamp: activityTime,
      lat: activity.latitudeE7 / 1e7,
      lng: activity.longitudeE7 / 1e7,
    };
  }
  return null;
}

function parseGoogleLocationJson(raw: unknown): TrackPoint[] {
  if (Array.isArray(raw)) {
    return raw.map(asTrackPoint).filter((item): item is TrackPoint => Boolean(item));
  }
  if (!raw || typeof raw !== "object") return [];
  const doc = raw as { locations?: GoogleLocationRecord[]; timelineObjects?: GoogleTimelineObject[] };

  if (Array.isArray(doc.locations)) {
    return doc.locations
      .map((item) => toPointFromLocationRecord(item))
      .filter((item): item is TrackPoint => Boolean(item));
  }

  if (Array.isArray(doc.timelineObjects)) {
    return doc.timelineObjects
      .map((item) => toPointFromTimelineObject(item))
      .filter((item): item is TrackPoint => Boolean(item));
  }

  return [];
}

function downsample(points: TrackPoint[], maxPoints = 2500): TrackPoint[] {
  if (points.length <= maxPoints) return points;
  const step = Math.ceil(points.length / maxPoints);
  return points.filter((_, idx) => idx % step === 0);
}

function haversineKm(a: TrackPoint, b: TrackPoint): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export default function LocationStoryPage() {
  const [points, setPoints] = useState<TrackPoint[]>(sampleData as TrackPoint[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMs, setPlaybackMs] = useState(700);
  const [error, setError] = useState<string | null>(null);

  const orderedPoints = useMemo(
    () => [...points].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [points]
  );

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [points]);

  useEffect(() => {
    if (!isPlaying || orderedPoints.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= orderedPoints.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackMs);
    return () => clearInterval(timer);
  }, [isPlaying, playbackMs, orderedPoints.length]);

  const current = orderedPoints[currentIndex];
  const start = orderedPoints[0];
  const end = orderedPoints[orderedPoints.length - 1];
  const totalDistanceKm = orderedPoints.reduce((sum, point, idx) => {
    if (idx === 0) return sum;
    return sum + haversineKm(orderedPoints[idx - 1], point);
  }, 0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      const parsed = downsample(parseGoogleLocationJson(json));
      if (parsed.length < 2) {
        setError("Could not find enough location points. Try a Google Takeout Location History JSON file.");
        return;
      }
      setPoints(parsed);
    } catch {
      setError("Failed to parse that file. Please upload a valid JSON export.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/jordan" className="text-gray-500 hover:text-white transition-colors text-sm">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Location Story Timeline</h1>
      </div>

      <section className="glass rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Turn your location history into a travel story</h2>
        <p className="text-sm text-gray-400">
          Upload Google Takeout location JSON and replay your movement over time. Parsing happens in-browser and no file gets uploaded.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm text-gray-200 cursor-pointer transition-colors">
            Upload Location JSON
            <input type="file" accept="application/json" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => {
              setPoints(sampleData as TrackPoint[]);
              setError(null);
            }}
            className="px-4 py-2 rounded-full glass glass-hover text-sm text-gray-300"
          >
            Use Sample Data
          </button>
          <a
            href="https://takeout.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-300 hover:text-cyan-200"
          >
            Get Google Takeout file
          </a>
        </div>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Points</p>
          <p className="text-2xl font-bold text-white mt-1">{orderedPoints.length.toLocaleString()}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Time Range</p>
          <p className="text-sm font-medium text-gray-200 mt-2">
            {start ? new Date(start.timestamp).toLocaleDateString() : "--"} to{" "}
            {end ? new Date(end.timestamp).toLocaleDateString() : "--"}
          </p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Approx Distance</p>
          <p className="text-2xl font-bold text-white mt-1">{Math.round(totalDistanceKm).toLocaleString()} km</p>
        </div>
      </section>

      <section className="glass rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            disabled={orderedPoints.length < 2}
            className="px-4 py-2 rounded-full bg-cyan-400 text-gray-950 text-sm font-semibold disabled:opacity-50"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-4 py-2 rounded-full bg-white/10 text-gray-200 text-sm"
          >
            Restart
          </button>
          <label className="text-sm text-gray-400">
            Speed
            <select
              className="ml-2 bg-gray-900 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-200"
              value={playbackMs}
              onChange={(e) => setPlaybackMs(Number(e.target.value))}
            >
              <option value={1200}>Slow</option>
              <option value={700}>Normal</option>
              <option value={350}>Fast</option>
            </select>
          </label>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(orderedPoints.length - 1, 0)}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-300">
          <p>
            Frame {Math.min(currentIndex + 1, orderedPoints.length)} / {orderedPoints.length}
          </p>
          <p>{current ? new Date(current.timestamp).toLocaleString() : "No point selected"}</p>
          <p>{current?.label ?? `${current?.lat.toFixed(4)}, ${current?.lng.toFixed(4)}`}</p>
        </div>
      </section>

      <section className="space-y-3">
        <StoryMap points={orderedPoints} currentIndex={currentIndex} />
        <p className="text-xs text-gray-600">
          For large exports, this sample downsamples points to keep playback smooth. Next step is clustering and day-by-day chapters.
        </p>
      </section>
    </div>
  );
}
