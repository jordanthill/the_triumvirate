"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Chess piece types
type PieceType = "k" | "q" | "r" | "b" | "n" | "p" | "K" | "Q" | "R" | "B" | "N" | "P" | null;
type Board = PieceType[][];
type Position = { row: number; col: number };

// Puzzle structure
interface ChessPuzzle {
  id: number;
  name: string;
  board: Board;
  playerColor: "white" | "black";
  solution: string[];
  description: string;
}

// Starting puzzles - classic mate in 2/3 positions
const PUZZLES: ChessPuzzle[] = [
  {
    id: 1,
    name: "Back Rank Mate",
    playerColor: "white",
    description: "White to move and checkmate in 2 moves",
    solution: ["Qd8+", "Qxf8#"],
    board: [
      [null, null, null, null, null, "r", "k", null],
      [null, null, null, null, null, "p", "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, "Q", null, null, null, null],
      [null, null, null, null, null, null, "K", null],
    ],
  },
  {
    id: 2,
    name: "Scholar's Mate Defense",
    playerColor: "black",
    description: "Black to move and checkmate in 3 moves",
    solution: ["Qh4+", "g3", "Qxg3#"],
    board: [
      ["r", "n", "b", null, "k", "b", "n", "r"],
      ["p", "p", "p", "p", null, "p", "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, "p", null, null, null],
      [null, null, "B", null, "P", null, null, null],
      [null, null, null, null, null, "N", null, null],
      ["P", "P", "P", "P", null, "P", "P", "P"],
      ["R", "N", "B", "Q", "K", null, null, "R"],
    ],
  },
  {
    id: 3,
    name: "Queen and Rook Mate",
    playerColor: "white",
    description: "White to move and checkmate in 2 moves",
    solution: ["Qf7+", "Qg8#"],
    board: [
      [null, null, null, null, null, null, "k", null],
      [null, null, null, null, null, null, "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, "Q", null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["R", null, null, null, null, null, "K", null],
    ],
  },
  {
    id: 4,
    name: "Smothered Mate",
    playerColor: "white",
    description: "White to move and checkmate in 3 moves",
    solution: ["Qg8+", "Rxg8", "Nf7#"],
    board: [
      [null, null, null, null, null, "r", "k", null],
      [null, null, null, null, null, "p", "p", "p"],
      [null, null, null, null, null, null, "n", null],
      [null, null, null, null, "N", null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, "Q", null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, "K", null],
    ],
  },
  {
    id: 5,
    name: "Anastasia's Mate",
    playerColor: "white",
    description: "White to move and checkmate in 2 moves",
    solution: ["Rh8+", "Rh7#"],
    board: [
      [null, null, null, null, null, null, "k", null],
      [null, null, null, null, null, "p", "n", "p"],
      [null, null, null, null, null, null, "p", null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, "N", null, null],
      [null, null, null, null, null, null, null, null],
      ["R", null, null, null, null, null, "K", null],
    ],
  },
];

// Piece symbols (Unicode chess pieces)
const PIECE_SYMBOLS: Record<string, string> = {
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
};

export default function ChessPuzzlesPage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [board, setBoard] = useState<Board>([]);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const [moveCount, setMoveCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "check">("playing");
  const [message, setMessage] = useState("");
  const [highlightedSquares, setHighlightedSquares] = useState<Position[]>([]);

  const currentPuzzle = PUZZLES[currentPuzzleIndex];

  // Initialize board
  useEffect(() => {
    resetPuzzle();
  }, [currentPuzzleIndex]);

  const resetPuzzle = () => {
    setBoard(currentPuzzle.board.map(row => [...row]));
    setCurrentTurn(currentPuzzle.playerColor);
    setSelectedSquare(null);
    setMoveCount(0);
    setGameStatus("playing");
    setMessage(`${currentPuzzle.description}`);
    setHighlightedSquares([]);
  };

  const loadNextPuzzle = () => {
    setCurrentPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
  };

  const loadRandomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * PUZZLES.length);
    setCurrentPuzzleIndex(randomIndex);
  };

  const isWhitePiece = (piece: PieceType): boolean => {
    return piece !== null && piece === piece.toUpperCase();
  };

  const canPieceMove = (piece: PieceType): boolean => {
    if (piece === null) return false;
    const isPieceWhite = isWhitePiece(piece);
    return (currentTurn === "white" && isPieceWhite) || (currentTurn === "black" && !isPieceWhite);
  };

  const isValidMove = (from: Position, to: Position): boolean => {
    const piece = board[from.row][from.col];
    if (!piece) return false;

    const targetPiece = board[to.row][to.col];

    // Can't capture your own piece
    if (targetPiece && isWhitePiece(piece) === isWhitePiece(targetPiece)) {
      return false;
    }

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const pieceType = piece.toLowerCase();

    switch (pieceType) {
      case "p": // Pawn
        const direction = isWhitePiece(piece) ? -1 : 1;
        const startRow = isWhitePiece(piece) ? 6 : 1;

        // Forward move
        if (colDiff === 0 && rowDiff === direction && !targetPiece) return true;
        // Double move from start
        if (colDiff === 0 && from.row === startRow && rowDiff === 2 * direction && !targetPiece && !board[from.row + direction][from.col]) return true;
        // Capture
        if (Math.abs(colDiff) === 1 && rowDiff === direction && targetPiece) return true;
        return false;

      case "n": // Knight
        return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);

      case "b": // Bishop
        if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
        return isPathClear(from, to);

      case "r": // Rook
        if (rowDiff !== 0 && colDiff !== 0) return false;
        return isPathClear(from, to);

      case "q": // Queen
        if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
        return isPathClear(from, to);

      case "k": // King
        return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (from: Position, to: Position): boolean => {
    const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0;
    const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0;

    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  const findKing = (isWhite: boolean): Position | null => {
    const kingSymbol = isWhite ? "K" : "k";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingSymbol) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isSquareUnderAttack = (pos: Position, byWhite: boolean): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && isWhitePiece(piece) === byWhite) {
          if (isValidMove({ row, col }, pos)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const isInCheck = (isWhiteKing: boolean): boolean => {
    const kingPos = findKing(isWhiteKing);
    if (!kingPos) return false;
    return isSquareUnderAttack(kingPos, !isWhiteKing);
  };

  const hasLegalMoves = (isWhite: boolean): boolean => {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && isWhitePiece(piece) === isWhite) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove({ row: fromRow, col: fromCol }, { row: toRow, col: toCol })) {
                // Simulate the move
                const newBoard = board.map(row => [...row]);
                newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
                newBoard[fromRow][fromCol] = null;

                // Check if king is still in check after this move
                const originalBoard = board;
                setBoard(newBoard);
                const stillInCheck = isInCheck(isWhite);
                setBoard(originalBoard);

                if (!stillInCheck) return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  const isCheckmate = (isWhiteKing: boolean): boolean => {
    return isInCheck(isWhiteKing) && !hasLegalMoves(isWhiteKing);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus !== "playing" && gameStatus !== "check") return;

    const clickedPiece = board[row][col];

    // If a square is selected
    if (selectedSquare) {
      const from = selectedSquare;
      const to = { row, col };

      // Try to move
      if (isValidMove(from, to)) {
        // Make the move
        const newBoard = board.map(row => [...row]);
        const movedPiece = newBoard[from.row][from.col];
        newBoard[to.row][to.col] = movedPiece;
        newBoard[from.row][from.col] = null;

        setBoard(newBoard);
        setSelectedSquare(null);
        setHighlightedSquares([from, to]);
        setMoveCount(moveCount + 1);

        // Check game state after move
        setTimeout(() => {
          const opponentColor = currentTurn === "white" ? "black" : "white";
          const opponentIsWhite = opponentColor === "white";

          if (isCheckmate(opponentIsWhite)) {
            setGameStatus("won");
            setMessage("🎉 Checkmate! You solved the puzzle!");
          } else if (isInCheck(opponentIsWhite)) {
            setGameStatus("check");
            setMessage("Check! Keep going...");
            setCurrentTurn(opponentColor);
          } else {
            setGameStatus("playing");
            setMessage("Good move! Continue...");
            setCurrentTurn(opponentColor);
          }
        }, 100);
      } else {
        // Invalid move - select new piece if it's clickable
        if (clickedPiece && canPieceMove(clickedPiece)) {
          setSelectedSquare({ row, col });
          setHighlightedSquares([]);
        } else {
          setSelectedSquare(null);
          setHighlightedSquares([]);
        }
      }
    } else {
      // No square selected - select this one if it has a moveable piece
      if (clickedPiece && canPieceMove(clickedPiece)) {
        setSelectedSquare({ row, col });
        setHighlightedSquares([]);
      }
    }
  };

  const isSquareHighlighted = (row: number, col: number): boolean => {
    return highlightedSquares.some(sq => sq.row === row && sq.col === col);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/brian"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Brian's Section
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Chess Puzzles</h1>
        <p className="text-gray-400">Solve tactical chess puzzles. Find the winning moves!</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Chess Board */}
        <div className="flex flex-col items-center">
          <div className="mb-4 p-4 rounded-lg glass w-full max-w-[600px]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{currentPuzzle.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{currentPuzzle.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Puzzle {currentPuzzleIndex + 1} of {PUZZLES.length}</div>
                <div className="text-sm text-gray-400">Moves: {moveCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow-2xl">
            <div className="grid grid-cols-8 gap-0 w-[600px] h-[600px] border-2 border-gray-700">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                  const isHighlighted = isSquareHighlighted(rowIndex, colIndex);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`
                        flex items-center justify-center text-6xl cursor-pointer transition-all
                        ${isLight ? "bg-amber-100" : "bg-amber-700"}
                        ${isSelected ? "ring-4 ring-blue-500 ring-inset" : ""}
                        ${isHighlighted ? "ring-4 ring-green-500 ring-inset" : ""}
                        hover:opacity-80
                      `}
                    >
                      {piece && (
                        <span className={`select-none ${isWhitePiece(piece) ? "text-gray-100 drop-shadow-lg" : "text-gray-900"}`}>
                          {PIECE_SYMBOLS[piece]}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className={`p-6 rounded-xl ${
            gameStatus === "won" ? "bg-green-500/20 border-2 border-green-500" :
            gameStatus === "check" ? "bg-yellow-500/20 border-2 border-yellow-500" :
            "glass"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-3 w-3 rounded-full ${
                gameStatus === "won" ? "bg-green-500" :
                gameStatus === "check" ? "bg-yellow-500 animate-pulse" :
                currentTurn === "white" ? "bg-gray-100" : "bg-gray-900"
              }`} />
              <span className="font-semibold text-white">
                {gameStatus === "won" ? "Puzzle Solved!" :
                 gameStatus === "check" ? "Check!" :
                 `${currentTurn === "white" ? "White" : "Black"} to move`}
              </span>
            </div>
            <p className="text-sm text-gray-300">{message}</p>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <button
              onClick={resetPuzzle}
              className="w-full px-4 py-3 rounded-lg glass glass-hover text-white font-medium transition-all"
            >
              Reset Puzzle
            </button>
            <button
              onClick={loadNextPuzzle}
              className="w-full px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all"
            >
              Next Puzzle
            </button>
            <button
              onClick={loadRandomPuzzle}
              className="w-full px-4 py-3 rounded-lg glass glass-hover text-white font-medium transition-all"
            >
              Random Puzzle
            </button>
          </div>

          {/* How to Play */}
          <div className="p-6 rounded-xl glass">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Play
            </h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Click a piece to select it</li>
              <li>• Click a square to move the piece</li>
              <li>• Find the sequence of moves to checkmate</li>
              <li>• Each puzzle has a specific solution</li>
              <li>• Selected pieces show a blue highlight</li>
              <li>• Last move shows a green highlight</li>
            </ul>
          </div>

          {/* Puzzle Info */}
          <div className="p-6 rounded-xl glass">
            <h3 className="font-semibold text-white mb-3">Current Puzzle</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Name: <span className="text-white">{currentPuzzle.name}</span></div>
              <div>Your Color: <span className="text-white capitalize">{currentPuzzle.playerColor}</span></div>
              <div>Moves to Win: <span className="text-white">{currentPuzzle.solution.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
