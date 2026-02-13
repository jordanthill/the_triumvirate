"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const CANVAS_W = 400;
const CANVAS_H = 600;
const BIRD_SIZE = 20;
const GRAVITY = 0.45;
const JUMP = -7;
const PIPE_WIDTH = 52;
const PIPE_GAP = 150;
const PIPE_SPEED = 2.5;
const PIPE_INTERVAL = 100; // frames between pipes

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

export default function FlappyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const stateRef = useRef({
    birdY: CANVAS_H / 2,
    birdVel: 0,
    pipes: [] as Pipe[],
    frame: 0,
    score: 0,
    gameState: "idle" as "idle" | "playing" | "dead",
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === "idle" || s.gameState === "dead") {
      // Reset
      s.birdY = CANVAS_H / 2;
      s.birdVel = 0;
      s.pipes = [];
      s.frame = 0;
      s.score = 0;
      s.gameState = "playing";
      setGameState("playing");
      setScore(0);
    }
    if (s.gameState === "playing") {
      s.birdVel = JUMP;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onClick = () => jump();

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onClick, { passive: true });

    let raf: number;

    const drawBird = (y: number, vel: number) => {
      ctx.save();
      ctx.translate(80, y);
      const angle = Math.min(Math.max(vel * 3, -30), 70) * (Math.PI / 180);
      ctx.rotate(angle);

      // Body
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_SIZE, BIRD_SIZE * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.ellipse(-4, 2, BIRD_SIZE * 0.5, BIRD_SIZE * 0.3, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(8, -6, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1f2937";
      ctx.beginPath();
      ctx.arc(10, -6, 3, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(BIRD_SIZE - 2, -2);
      ctx.lineTo(BIRD_SIZE + 10, 2);
      ctx.lineTo(BIRD_SIZE - 2, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawPipe = (pipe: Pipe) => {
      // Top pipe
      const grad1 = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      grad1.addColorStop(0, "#22c55e");
      grad1.addColorStop(0.5, "#4ade80");
      grad1.addColorStop(1, "#16a34a");
      ctx.fillStyle = grad1;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);
      // Top pipe lip
      ctx.fillStyle = "#15803d";
      ctx.fillRect(pipe.x - 3, pipe.topH - 20, PIPE_WIDTH + 6, 20);

      // Bottom pipe
      const bottomY = pipe.topH + PIPE_GAP;
      ctx.fillStyle = grad1;
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_H - bottomY);
      // Bottom pipe lip
      ctx.fillStyle = "#15803d";
      ctx.fillRect(pipe.x - 3, bottomY, PIPE_WIDTH + 6, 20);
    };

    const loop = () => {
      const s = stateRef.current;

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      bgGrad.addColorStop(0, "#0f172a");
      bgGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, CANVAS_H - 2, CANVAS_W, 2);

      if (s.gameState === "playing") {
        // Physics
        s.birdVel += GRAVITY;
        s.birdY += s.birdVel;
        s.frame++;

        // Spawn pipes
        if (s.frame % PIPE_INTERVAL === 0) {
          const minH = 60;
          const maxH = CANVAS_H - PIPE_GAP - 60;
          const topH = Math.random() * (maxH - minH) + minH;
          s.pipes.push({ x: CANVAS_W, topH, scored: false });
        }

        // Update pipes
        for (let i = s.pipes.length - 1; i >= 0; i--) {
          s.pipes[i].x -= PIPE_SPEED;

          // Score
          if (!s.pipes[i].scored && s.pipes[i].x + PIPE_WIDTH < 80) {
            s.pipes[i].scored = true;
            s.score++;
            setScore(s.score);
          }

          // Remove off-screen
          if (s.pipes[i].x + PIPE_WIDTH < 0) {
            s.pipes.splice(i, 1);
          }
        }

        // Collision detection
        const birdLeft = 80 - BIRD_SIZE;
        const birdRight = 80 + BIRD_SIZE;
        const birdTop = s.birdY - BIRD_SIZE * 0.75;
        const birdBottom = s.birdY + BIRD_SIZE * 0.75;

        // Floor / ceiling
        if (birdBottom >= CANVAS_H || birdTop <= 0) {
          s.gameState = "dead";
          setGameState("dead");
          setBest((prev) => Math.max(prev, s.score));
        }

        // Pipes
        for (const pipe of s.pipes) {
          if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topH || birdBottom > pipe.topH + PIPE_GAP) {
              s.gameState = "dead";
              setGameState("dead");
              setBest((prev) => Math.max(prev, s.score));
            }
          }
        }
      }

      // Draw pipes
      for (const pipe of s.pipes) {
        drawPipe(pipe);
      }

      // Draw bird
      const displayY =
        s.gameState === "idle" ? CANVAS_H / 2 + Math.sin(Date.now() / 300) * 10 : s.birdY;
      drawBird(displayY, s.gameState === "playing" ? s.birdVel : 0);

      // Score display
      ctx.fillStyle = "white";
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "center";
      if (s.gameState === "playing") {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText(String(s.score), CANVAS_W / 2, 50);
        ctx.shadowBlur = 0;
      }

      // Idle / dead overlay
      if (s.gameState === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "white";
        ctx.font = "bold 28px sans-serif";
        ctx.fillText("Flappy Bird", CANVAS_W / 2, CANVAS_H / 2 - 40);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Click or press Space to play", CANVAS_W / 2, CANVAS_H / 2 + 10);
      }

      if (s.gameState === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 32px sans-serif";
        ctx.fillText("Game Over", CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(`Score: ${s.score}`, CANVAS_W / 2, CANVAS_H / 2 + 10);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Click to play again", CANVAS_W / 2, CANVAS_H / 2 + 45);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onClick);
    };
  }, [jump]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/jordan"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Flappy Bird</h1>
        {best > 0 && (
          <span className="ml-auto text-sm text-gray-500">
            Best: <span className="text-yellow-400 font-semibold">{best}</span>
          </span>
        )}
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-2xl border border-white/5 cursor-pointer"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      <p className="text-center text-gray-500 text-sm">
        Click, tap, or press Space / &uarr; to flap
      </p>
    </div>
  );
}
