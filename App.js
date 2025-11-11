import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((s) => s !== null)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">{[0, 1, 2].map((i) => renderSquare(i))}</div>
      <div className="board-row">{[3, 4, 5].map((i) => renderSquare(i))}</div>
      <div className="board-row">{[6, 7, 8].map((i) => renderSquare(i))}</div>
    </>
  );

  function renderSquare(i) {
    return <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />;
  }
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winnerMessage, setWinnerMessage] = useState("");

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);

  useEffect(() => {
    if (winner) {
      setWinnerMessage(`🏆 WINNER: PLAYER ${winner}`);

      setTimeout(() => {
        const duration = 2 * 1000;
        const end = Date.now() + duration;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }, 300);

      const timer = setTimeout(() => setWinnerMessage(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinnerMessage("");
  }

  function undoMove() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

        <div className="button-row">
          <button className="restart-btn" onClick={restartGame}>
            Restart
          </button>
          <button
            className="undo-btn"
            onClick={undoMove}
            disabled={currentMove === 0}
          >
            Undo Move
          </button>
        </div>
      </div>

      {winnerMessage && (
        <div className="winner-overlay">
          <div className="winner-text">{winnerMessage}</div>
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
