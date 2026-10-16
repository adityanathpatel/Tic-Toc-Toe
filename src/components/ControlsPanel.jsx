import React from 'react';

export default function ControlsPanel({
  gameMode,
  onModeChange,
  aiDifficulty,
  onDifficultyChange,
  humanSymbol,
  onSymbolChange
}) {
  return (
    <section className="controls-panel" aria-label="Game settings">
      {/* Game Mode */}
      <div className="control-group">
        <label className="control-label" htmlFor="gameModeSelect">Game Mode</label>
        <div className="pill-group" role="radiogroup" aria-label="Game Mode">
          <button
            type="button"
            id="modePvcBtn"
            className={`pill-btn ${gameMode === 'pvc' ? 'active' : ''}`}
            role="radio"
            aria-checked={gameMode === 'pvc'}
            onClick={() => onModeChange('pvc')}
          >
            <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>vs Computer</span>
          </button>
          <button
            type="button"
            id="modePvpBtn"
            className={`pill-btn ${gameMode === 'pvp' ? 'active' : ''}`}
            role="radio"
            aria-checked={gameMode === 'pvp'}
            onClick={() => onModeChange('pvp')}
          >
            <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>2 Players</span>
          </button>
          <button
            type="button"
            id="modeOnlineBtn"
            className={`pill-btn ${gameMode === 'online' ? 'active' : ''}`}
            role="radio"
            aria-checked={gameMode === 'online'}
            onClick={() => onModeChange('online')}
          >
            <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Play Online</span>
          </button>
        </div>
      </div>

      {/* AI Difficulty (only in PvC) */}
      {gameMode === 'pvc' && (
        <div className="control-group" id="difficultyGroup">
          <label className="control-label" htmlFor="difficultySelect">AI Level</label>
          <div className="select-wrapper">
            <select
              id="difficultySelect"
              aria-label="AI Difficulty Level"
              value={aiDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <option value="unbeatable">Unbeatable (Minimax)</option>
              <option value="medium">Challenging (Smart)</option>
              <option value="easy">Casual (Easy)</option>
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Side Selection (only in PvC) */}
      {gameMode === 'pvc' && (
        <div className="control-group" id="sideSelectionGroup">
          <label className="control-label">Your Symbol</label>
          <div className="pill-group symbol-picker" role="radiogroup" aria-label="Select Player Symbol">
            <button
              type="button"
              id="chooseXBtn"
              className={`symbol-btn ${humanSymbol === 'X' ? 'active' : ''}`}
              role="radio"
              aria-checked={humanSymbol === 'X'}
              onClick={() => onSymbolChange('X')}
            >
              <span className="sym x-sym">X</span>
              <span className="subtext">Goes First</span>
            </button>
            <button
              type="button"
              id="chooseOBtn"
              className={`symbol-btn ${humanSymbol === 'O' ? 'active' : ''}`}
              role="radio"
              aria-checked={humanSymbol === 'O'}
              onClick={() => onSymbolChange('O')}
            >
              <span className="sym o-sym">O</span>
              <span className="subtext">Goes Second</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
