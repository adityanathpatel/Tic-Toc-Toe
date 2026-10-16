import React, { useState, useEffect } from 'react';

export default function ActionToolbar({ onRestart, onResetScores }) {
  const [recentlyReset, setRecentlyReset] = useState(false);

  useEffect(() => {
    if (recentlyReset) {
      const timer = setTimeout(() => {
        setRecentlyReset(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [recentlyReset]);

  const handleResetClick = () => {
    onResetScores();
    setRecentlyReset(true);
  };

  return (
    <div className="action-toolbar" role="toolbar" aria-label="Game controls">
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
        className={`action-btn ${recentlyReset ? 'success-btn' : 'secondary-btn'}`}
        title="Reset match scores to zero"
        onClick={handleResetClick}
      >
        {recentlyReset ? (
          <>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style={{ color: '#10b981' }}>Scores Reset!</span>
          </>
        ) : (
          <>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            <span>Reset Scores</span>
          </>
        )}
      </button>
    </div>
  );
}
