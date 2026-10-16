import React from 'react';

export default function Header({ soundEnabled, onToggleSound, onOpenHelp }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">
          <span className="brand-x">X</span>
          <span className="brand-slash">/</span>
          <span className="brand-o">O</span>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">TIC-TAC-TOE</h1>
          <p className="brand-subtitle">ULTIMATE ARENA</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          id="soundToggleBtn"
          className="icon-btn"
          aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          title="Toggle Sound (M)"
          onClick={onToggleSound}
        >
          {soundEnabled ? (
            <svg id="soundOnIcon" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg id="soundOffIcon" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
          <span className="btn-label" id="soundStatusText">
            {soundEnabled ? 'Sound ON' : 'Muted'}
          </span>
        </button>

        <button
          id="helpBtn"
          className="icon-btn"
          aria-label="Game rules and keyboard controls"
          title="How to play"
          onClick={onOpenHelp}
        >
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
