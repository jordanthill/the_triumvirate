"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function ParticlesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animationRef = useRef<number>(0);

  const spawnParticles = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: Math.random() * 40 + 40,
        size: Math.random() * 4 + 2,
        hue: Math.random() * 60 + 240, // Blue to purple range
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
      spawnParticles(mouseRef.current.x, mouseRef.current.y, 3);
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
      mouseRef.current.active = true;
      spawnParticles(mouseRef.current.x, mouseRef.current.y, 3);
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    const animate = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // Slight gravity
        p.vx *= 0.99; // Friction
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`;
        ctx.fill();
      }

      // Draw cursor glow when active
      if (mouseRef.current.active) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          60
        );
        gradient.addColorStop(0, "rgba(129, 140, 248, 0.12)");
        gradient.addColorStop(1, "rgba(129, 140, 248, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(
          mouseRef.current.x - 60,
          mouseRef.current.y - 60,
          120,
          120
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, [spawnParticles]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/jordan"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Particle Trail</h1>
      </div>

      <p className="text-gray-400 text-sm">
        Move your mouse (or finger on mobile) across the canvas below.
      </p>

      <div className="relative w-full rounded-2xl overflow-hidden glass" style={{ height: "70vh" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-700 text-sm select-none">
            Move your cursor here
          </p>
        </div>
      </div>
    </div>
  );
}
