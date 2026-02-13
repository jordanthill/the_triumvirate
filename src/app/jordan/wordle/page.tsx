"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const WORDS = [
  "crane","slate","trace","crate","arise","stare","snare","phase","blaze",
  "globe","pride","stone","brave","shine","drove","plane","smile","spoke",
  "frame","gripe","those","prime","swore","glide","prize","froze","chose",
  "whale","brute","scope","spore","tribe","trove","flare","spare","store",
  "shade","shape","share","stale","stake","snake","space","place","grace",
  "brace","dance","lance","range","mange","haste","waste","paste","taste",
  "crest","feast","beast","least","yeast","ghost","roast","toast","coast",
  "blast","moist","exist","twist","wrist","drift","shift","swift","cliff",
  "bluff","stuff","gruff","chunk","drunk","trunk","skunk","plumb","thumb",
  "climb","light","night","fight","right","sight","tight","might","eight",
  "weigh","reign","their","world","would","could","should","about","after",
  "heart","earth","water","power","tower","lower","other","under","super",
  "house","mouse","noise","voice","juice","sauce","peace","piece","force",
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

type LetterState = "correct" | "present" | "absent" | "empty";

interface TileData {
  letter: string;
  state: LetterState;
}

function getWordOfDay(): string {
  const start = new Date(2024, 0, 1).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return WORDS[day % WORDS.length].toUpperCase();
}

function evaluateGuess(guess: string, answer: string): TileData[] {
  const result: TileData[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i],
    state: "absent" as LetterState,
  }));

  const answerChars = answer.split("");
  const used = new Array(WORD_LENGTH).fill(false);

  // First pass: correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i].state = "correct";
      used[i] = true;
      answerChars[i] = "";
    }
  }

  // Second pass: present but wrong position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === "correct") continue;
    const idx = answerChars.indexOf(guess[i]);
    if (idx !== -1) {
      result[i].state = "present";
      answerChars[idx] = "";
    }
  }

  return result;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
];

const stateColors: Record<LetterState, string> = {
  correct: "bg-emerald-600 border-emerald-500",
  present: "bg-yellow-600 border-yellow-500",
  absent: "bg-gray-700 border-gray-600",
  empty: "bg-transparent border-gray-700",
};

const keyColors: Record<LetterState, string> = {
  correct: "bg-emerald-600 text-white",
  present: "bg-yellow-600 text-white",
  absent: "bg-gray-700 text-gray-400",
  empty: "bg-white/10 text-white hover:bg-white/20",
};

export default function WordlePage() {
  const [answer] = useState(getWordOfDay);
  const [guesses, setGuesses] = useState<TileData[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");

  const keyboardState = useCallback((): Record<string, LetterState> => {
    const map: Record<string, LetterState> = {};
    for (const guess of guesses) {
      for (const tile of guess) {
        const prev = map[tile.letter];
        if (tile.state === "correct") {
          map[tile.letter] = "correct";
        } else if (tile.state === "present" && prev !== "correct") {
          map[tile.letter] = "present";
        } else if (!prev) {
          map[tile.letter] = tile.state;
        }
      }
    }
    return map;
  }, [guesses]);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  }, []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showMessage("Not enough letters");
      return;
    }

    const result = evaluateGuess(currentGuess, answer);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === answer) {
      setWon(true);
      setGameOver(true);
      showMessage("Brilliant!");
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      showMessage(answer);
    }
  }, [currentGuess, answer, guesses, showMessage]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return;
      if (key === "ENTER") {
        submitGuess();
      } else if (key === "DEL" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [gameOver, currentGuess, submitGuess]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setWon(false);
  };

  // Build grid rows
  const rows: TileData[][] = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      rows.push(guesses[i]);
    } else if (i === guesses.length) {
      // Current input row
      rows.push(
        Array.from({ length: WORD_LENGTH }, (_, j) => ({
          letter: currentGuess[j] || "",
          state: "empty" as LetterState,
        }))
      );
    } else {
      rows.push(
        Array.from({ length: WORD_LENGTH }, () => ({
          letter: "",
          state: "empty" as LetterState,
        }))
      );
    }
  }

  const kbState = keyboardState();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/jordan"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Wordle</h1>
      </div>

      {/* Message */}
      <div className="h-8 flex items-center justify-center">
        {message && (
          <div className="px-4 py-1.5 rounded-lg bg-white text-gray-900 text-sm font-semibold">
            {message}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="flex flex-col items-center gap-1.5">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex gap-1.5 ${
              i === guesses.length && shake ? "animate-[shake_0.5s_ease-in-out]" : ""
            }`}
            style={
              i === guesses.length && shake
                ? {
                    animation: "shake 0.5s ease-in-out",
                  }
                : undefined
            }
          >
            {row.map((tile, j) => (
              <div
                key={j}
                className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-lg text-2xl font-bold uppercase transition-all duration-300 ${
                  stateColors[tile.state]
                } ${tile.letter && tile.state === "empty" ? "border-gray-500 scale-105" : ""}`}
                style={
                  i < guesses.length
                    ? {
                        animationDelay: `${j * 100}ms`,
                        animation: "flipIn 0.5s ease forwards",
                      }
                    : undefined
                }
              >
                {tile.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1.5 pt-4">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((key) => {
              const state = kbState[key] || "empty";
              const isWide = key === "ENTER" || key === "DEL";
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`${
                    isWide ? "px-3 text-xs" : "w-9 sm:w-10"
                  } h-12 rounded-lg font-semibold text-sm transition-colors ${
                    keyColors[state]
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Play again */}
      {gameOver && (
        <div className="text-center pt-2">
          <button
            onClick={resetGame}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes flipIn {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
