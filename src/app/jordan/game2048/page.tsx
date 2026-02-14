"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const SIZE = 4;

type Board = number[][];

function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandom(board: Board): Board {
  const b = board.map((r) => [...r]);
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return b;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return b;
}

function slideRow(row: number[]): { newRow: number[]; score: number } {
  let score = 0;
  // Remove zeros
  const nums = row.filter((n) => n !== 0);
  const result: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      result.push(merged);
      score += merged;
      i += 2;
    } else {
      result.push(nums[i]);
      i++;
    }
  }
  while (result.length < SIZE) result.push(0);
  return { newRow: result, score };
}

function moveLeft(board: Board): { board: Board; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;
  const newBoard = board.map((row) => {
    const { newRow, score } = slideRow(row);
    totalScore += score;
    if (row.some((v, i) => v !== newRow[i])) moved = true;
    return newRow;
  });
  return { board: newBoard, score: totalScore, moved };
}

function rotateBoard(board: Board): Board {
  const n = board.length;
  const rotated = createEmptyBoard();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = board[r][c];
    }
  }
  return rotated;
}

function move(board: Board, direction: "left" | "right" | "up" | "down"): { board: Board; score: number; moved: boolean } {
  let b = board;
  const rotations: Record<string, number> = { left: 0, down: 1, right: 2, up: 3 };
  const rots = rotations[direction];

  for (let i = 0; i < rots; i++) b = rotateBoard(b);
  const result = moveLeft(b);
  let newBoard = result.board;
  for (let i = 0; i < (4 - rots) % 4; i++) newBoard = rotateBoard(newBoard);

  return { board: newBoard, score: result.score, moved: result.moved };
}

function canMove(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true;
      if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return true;
      if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function hasWon(board: Board): boolean {
  return board.some((row) => row.some((cell) => cell >= 2048));
}

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-white/5", text: "" },
  2: { bg: "bg-gray-200", text: "text-gray-800" },
  4: { bg: "bg-gray-300", text: "text-gray-800" },
  8: { bg: "bg-orange-400", text: "text-white" },
  16: { bg: "bg-orange-500", text: "text-white" },
  32: { bg: "bg-orange-600", text: "text-white" },
  64: { bg: "bg-red-500", text: "text-white" },
  128: { bg: "bg-yellow-400", text: "text-white" },
  256: { bg: "bg-yellow-500", text: "text-white" },
  512: { bg: "bg-yellow-600", text: "text-white" },
  1024: { bg: "bg-amber-500", text: "text-white" },
  2048: { bg: "bg-emerald-500", text: "text-white" },
};

function getTileStyle(value: number) {
  return TILE_COLORS[value] || { bg: "bg-purple-600", text: "text-white" };
}

export default function Game2048Page() {
  const [board, setBoard] = useState<Board>(() => {
    let b = createEmptyBoard();
    b = addRandom(b);
    b = addRandom(b);
    return b;
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const handleMove = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (gameOver) return;
      const result = move(board, direction);
      if (!result.moved) return;

      const newBoard = addRandom(result.board);
      const newScore = score + result.score;
      setBoard(newBoard);
      setScore(newScore);
      setBest((prev) => Math.max(prev, newScore));

      if (hasWon(newBoard) && !won) {
        setWon(true);
      }

      if (!canMove(newBoard)) {
        setGameOver(true);
      }
    },
    [board, score, gameOver, won]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  // Swipe support
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchRef.current.x;
      const dy = touch.clientY - touchRef.current.y;
      const minSwipe = 30;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
        handleMove(dx > 0 ? "right" : "left");
      } else if (Math.abs(dy) > minSwipe) {
        handleMove(dy > 0 ? "down" : "up");
      }
      touchRef.current = null;
    },
    [handleMove]
  );

  const reset = () => {
    let b = createEmptyBoard();
    b = addRandom(b);
    b = addRandom(b);
    setBoard(b);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/jordan"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">2048</h1>
      </div>

      {/* Score bar */}
      <div className="flex items-center gap-4">
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl glass text-center min-w-[80px]">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
            <div className="text-lg font-bold text-white">{score}</div>
          </div>
          <div className="px-4 py-2 rounded-xl glass text-center min-w-[80px]">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Best</div>
            <div className="text-lg font-bold text-yellow-400">{best}</div>
          </div>
        </div>
        <button
          onClick={reset}
          className="ml-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors"
        >
          New Game
        </button>
      </div>

      {/* Board */}
      <div className="flex justify-center">
        <div className="relative p-3 rounded-2xl glass" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="grid grid-cols-4 gap-2">
            {board.flat().map((value, i) => {
              const style = getTileStyle(value);
              return (
                <div
                  key={i}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-bold transition-all duration-100 ${style.bg} ${style.text} ${
                    value >= 1024 ? "text-lg" : "text-xl"
                  } ${value >= 100 ? "text-lg" : ""}`}
                  style={{ width: 80, height: 80 }}
                >
                  {value > 0 ? value : ""}
                </div>
              );
            })}
          </div>

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-gray-950/70 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">Game Over</span>
              <span className="text-gray-400">Score: {score}</span>
              <button
                onClick={reset}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Win overlay */}
          {won && !gameOver && (
            <div className="absolute inset-0 bg-emerald-950/70 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
              <span className="text-2xl font-bold text-emerald-400">You Win!</span>
              <span className="text-gray-300">Score: {score}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setWon(false)}
                  className="px-6 py-2.5 rounded-full glass glass-hover text-white text-sm font-medium transition-colors"
                >
                  Keep Going
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  New Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Use arrow keys to slide tiles. Merge matching numbers to reach 2048!
      </p>
    </div>
  );
}
