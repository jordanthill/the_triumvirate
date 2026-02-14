"use client";

import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface TrackPoint {
  timestamp: string;
  lat: number;
  lng: number;
  label?: string;
}

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function StoryMap({
  points,
  currentIndex,
}: {
  points: TrackPoint[];
  currentIndex: number;
}) {
  const current = points[currentIndex];
  const path = points.slice(0, currentIndex + 1).map((p) => [p.lat, p.lng] as [number, number]);
  const center: [number, number] = current
    ? [current.lat, current.lng]
    : points[0]
      ? [points[0].lat, points[0].lng]
      : [39.5, -98.35];

  return (
    <MapContainer center={center} zoom={4} scrollWheelZoom className="h-[460px] w-full rounded-2xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {path.length > 1 && <Polyline positions={path} color="#22d3ee" weight={4} opacity={0.85} />}
      {points.map((point, idx) => (
        <Marker key={`${point.timestamp}-${idx}`} position={[point.lat, point.lng]} opacity={idx === currentIndex ? 1 : 0.45}>
          <Tooltip direction="top" offset={[0, -8]}>
            <div className="text-xs">
              <p>{new Date(point.timestamp).toLocaleString()}</p>
              {point.label && <p>{point.label}</p>}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
