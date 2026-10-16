import React from 'react';

export default function ActionToolbar({ onRestart, onResetScores }) {
  return (
    <footer className="action-toolbar">
      <button
        id="restartBtn"
        className="action-btn primary-btn"
        title="Restart Round (R)"
        onClick={onRestart}
      >
        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"></path>
        </svg>
        <span>Restart Game</span>
      </button>

      <button
        id="resetMatchBtn"
        className="action-btn secondary-btn"
        title="Reset match scores to zero"
        onClick={onResetScores}
      >
        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
        <span>Reset Scores</span>
      </button>
    </footer>
  );
}
