import React, { useEffect, useRef } from 'react';
import { ConfettiSystem } from '../utils/confetti';

export default function ResultModal({
  isOpen,
  winner,
  isDraw,
  scores,
  gameMode,
  humanSymbol,
  onPlayAgain,
  onClose
}) {
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && winner) {
      if (!confettiRef.current) {
        confettiRef.current = new ConfettiSystem(canvasRef.current);
      }
      confettiRef.current.start();
    } else if (confettiRef.current) {
      confettiRef.current.stop();
    }

    return () => {
      if (confettiRef.current) {
        confettiRef.current.stop();
      }
    };
  }, [isOpen, winner]);

  if (!isOpen) return null;

  let heading = '';
  let subtext = '';
  let badgeClass = 'modal-icon-badge';
  let badgeSymbol = '';

  if (winner) {
    badgeSymbol = winner;
    if (winner === 'X') badgeClass += ' x-winner';
    else badgeClass += ' o-winner';

    if (gameMode === 'pvc') {
      if (winner === humanSymbol) {
        heading = 'You Won!';
        subtext = 'Incredible! You defeated the computer!';
      } else {
        heading = 'Computer Won!';
        subtext = 'The computer claims victory this time. Try again!';
      }
    } else {
      const winnerName = winner === 'X' ? 'Player 1 (X)' : 'Player 2 (O)';
      heading = `${winnerName} Won!`;
      subtext = 'Great tactical battle and decisive victory!';
    }
  } else if (isDraw) {
    badgeSymbol = '=';
    badgeClass += ' tie-winner';
    heading = "It's a Stalemate!";
    subtext = 'A hard-fought draw. Perfectly matched opponents!';
  }

  return (
    <div
      className="modal-backdrop"
      id="resultModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalHeading"
      onClick={(e) => {
        if (e.target.id === 'resultModal') onClose();
      }}
    >
      <div className="modal-card">
        <div className="confetti-canvas-container" aria-hidden="true">
          <canvas ref={canvasRef} id="confettiCanvas" />
        </div>

        <div className={badgeClass} id="modalBadge">
          <span className="modal-sym" id="modalSymbolBadge">{badgeSymbol}</span>
        </div>

        <h2 className="modal-title" id="modalHeading">{heading}</h2>
        <p className="modal-message" id="modalSubtext">{subtext}</p>

        <div className="modal-stats-summary" id="modalStats">
          <div className="stat-pill"><span id="summaryX">X: {scores.X}</span></div>
          <div className="stat-pill"><span id="summaryTies">Ties: {scores.ties}</span></div>
          <div className="stat-pill"><span id="summaryO">O: {scores.O}</span></div>
        </div>

        <div className="modal-buttons">
          <button
            id="modalPlayAgainBtn"
            className="modal-btn confirm-btn"
            onClick={onPlayAgain}
            autoFocus
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Play Again
          </button>
          <button id="modalCloseBtn" className="modal-btn close-btn" onClick={onClose}>
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
}
