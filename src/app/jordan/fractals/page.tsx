"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface ViewPort {
  centerX: number;
  centerY: number;
  zoom: number;
}

const MAX_ITER_DEFAULT = 150;

const COLOR_SCHEMES = {
  electric: (iter: number, maxIter: number) => {
    if (iter === maxIter) return [0, 0, 0];
    const t = iter / maxIter;
    const r = Math.floor(9 * (1 - t) * t * t * t * 255);
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
    return [r, g, b];
  },
  neon: (iter: number, maxIter: number) => {
    if (iter === maxIter) return [0, 0, 0];
    const t = iter / maxIter;
    const r = Math.floor(Math.sin(t * Math.PI * 2) * 127 + 128);
    const g = Math.floor(Math.sin(t * Math.PI * 2 + 2) * 127 + 128);
    const b = Math.floor(Math.sin(t * Math.PI * 2 + 4) * 127 + 128);
    return [r, g, b];
  },
  fire: (iter: number, maxIter: number) => {
    if (iter === maxIter) return [0, 0, 0];
    const t = iter / maxIter;
    const r = Math.min(255, Math.floor(t * 3 * 255));
    const g = Math.min(255, Math.floor(Math.max(0, t * 3 - 1) * 255));
    const b = Math.min(255, Math.floor(Math.max(0, t * 3 - 2) * 255));
    return [r, g, b];
  },
  ocean: (iter: number, maxIter: number) => {
    if (iter === maxIter) return [0, 0, 0];
    const t = iter / maxIter;
    const r = Math.floor(t * t * 80);
    const g = Math.floor(t * 180);
    const b = Math.floor(Math.sqrt(t) * 255);
    return [r, g, b];
  },
};

type ColorScheme = keyof typeof COLOR_SCHEMES;

function renderMandelbrot(
  canvas: HTMLCanvasElement,
  view: ViewPort,
  maxIter: number,
  colorScheme: ColorScheme
) {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  const scale = 4 / (w * view.zoom);
  const colorFn = COLOR_SCHEMES[colorScheme];

  for (let px = 0; px < w; px++) {
    for (let py = 0; py < h; py++) {
      const x0 = view.centerX + (px - w / 2) * scale;
      const y0 = view.centerY + (py - h / 2) * scale;

      let x = 0;
      let y = 0;
      let iter = 0;

      while (x * x + y * y <= 4 && iter < maxIter) {
        const xTemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xTemp;
        iter++;
      }

      // Smooth coloring
      if (iter < maxIter) {
        const log2 = Math.log(2);
        const nu = Math.log(Math.log(Math.sqrt(x * x + y * y)) / log2) / log2;
        iter = iter + 1 - nu;
      }

      const [r, g, b] = colorFn(iter, maxIter);
      const idx = (py * w + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

const PRESETS: { name: string; view: ViewPort }[] = [
  { name: "Full Set", view: { centerX: -0.5, centerY: 0, zoom: 1 } },
  { name: "Seahorse Valley", view: { centerX: -0.747, centerY: 0.1, zoom: 30 } },
  { name: "Mini Brot", view: { centerX: -1.749, centerY: 0.0, zoom: 500 } },
  { name: "Spiral", view: { centerX: -0.1592, centerY: -1.0317, zoom: 80 } },
  { name: "Lightning", view: { centerX: 0.2855, centerY: 0.0122, zoom: 200 } },
];

export default function FractalPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<ViewPort>({ centerX: -0.5, centerY: 0, zoom: 1 });
  const [colorScheme, setColorScheme] = useState<ColorScheme>("electric");
  const [maxIter, setMaxIter] = useState(MAX_ITER_DEFAULT);
  const [rendering, setRendering] = useState(false);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setRendering(true);
    // Use requestAnimationFrame to avoid blocking UI
    requestAnimationFrame(() => {
      renderMandelbrot(canvas, view, maxIter, colorScheme);
      setRendering(false);
    });
  }, [view, maxIter, colorScheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    canvas.width = Math.min(parent.clientWidth, 800);
    canvas.height = Math.min(parent.clientWidth * 0.65, 520);
    render();
  }, [render]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const scale = 4 / (canvas.width * view.zoom);
      const worldX = view.centerX + (mx - canvas.width / 2) * scale;
      const worldY = view.centerY + (my - canvas.height / 2) * scale;

      const factor = e.deltaY < 0 ? 1.4 : 1 / 1.4;
      const newZoom = view.zoom * factor;

      // Pan towards cursor on zoom
      const newCenterX = worldX + (view.centerX - worldX) / factor;
      const newCenterY = worldY + (view.centerY - worldY) / factor;

      setView({ centerX: newCenterX, centerY: newCenterY, zoom: newZoom });
    },
    [view]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      const canvas = canvasRef.current!;
      const scale = 4 / (canvas.width * view.zoom);
      const dx = (e.clientX - lastMouse.current.x) * scale;
      const dy = (e.clientY - lastMouse.current.y) * scale;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setView((v) => ({
        ...v,
        centerX: v.centerX - dx,
        centerY: v.centerY - dy,
      }));
    },
    [view]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/jordan"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Fractal Explorer</h1>
        {rendering && (
          <span className="text-xs text-indigo-400 animate-pulse">Rendering...</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Color scheme */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Colors:</span>
          <div className="flex gap-1">
            {(Object.keys(COLOR_SCHEMES) as ColorScheme[]).map((scheme) => (
              <button
                key={scheme}
                onClick={() => setColorScheme(scheme)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  colorScheme === scheme
                    ? "bg-white text-gray-900"
                    : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {scheme}
              </button>
            ))}
          </div>
        </div>

        {/* Iterations */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Detail:</span>
          <input
            type="range"
            min={50}
            max={500}
            value={maxIter}
            onChange={(e) => setMaxIter(Number(e.target.value))}
            className="w-24 accent-indigo-500"
          />
          <span className="text-xs text-gray-400 w-8">{maxIter}</span>
        </div>

        {/* Zoom level */}
        <span className="text-xs text-gray-500 ml-auto">
          Zoom: {view.zoom.toFixed(1)}x
        </span>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 self-center">Jump to:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setView(preset.view)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <div className="rounded-2xl overflow-hidden glass p-1">
          <canvas
            ref={canvasRef}
            className="rounded-xl cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Scroll to zoom. Click and drag to pan. The Mandelbrot set rendered in real-time.
      </p>
    </div>
  );
}
