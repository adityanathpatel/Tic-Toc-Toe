import React, { useRef } from 'react';

export default function GameBoard({
  board,
  onCellClick,
  winningLine,
  winner,
  currentPlayer,
  isGameActive,
  gameMode,
  humanSymbol,
  isAiThinking
}) {
  const boardRef = useRef(null);

  const canShowPreview = isGameActive && !isAiThinking && (gameMode === 'pvp' || currentPlayer === humanSymbol);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCellClick(index);
      return;
    }

    let nextIndex = null;
    switch (e.key) {
      case 'ArrowUp':
        if (index >= 3) nextIndex = index - 3;
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (index <= 5) nextIndex = index + 3;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (index % 3 !== 0) nextIndex = index - 1;
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (index % 3 !== 2) nextIndex = index + 1;
        e.preventDefault();
        break;
      default:
        break;
    }

    if (nextIndex !== null && boardRef.current) {
      const nextCell = boardRef.current.querySelector(`#cell-${nextIndex}`);
      if (nextCell) nextCell.focus();
    }
  };

  return (
    <main className="board-wrapper">
      <div className="board-frame">
        <div
          className="board-grid"
          id="board"
          ref={boardRef}
          role="grid"
          aria-label="Tic Tac Toe 3 by 3 game board"
        >
          {board.map((cellValue, idx) => {
            const isTaken = cellValue !== null;
            const isWinningCell = winningLine && winningLine.combo.includes(idx);
            
            let cellClasses = 'cell';
            if (isTaken) cellClasses += ' taken';
            if (isWinningCell) {
              cellClasses += ` winner-cell ${winner === 'X' ? 'winner-x' : 'winner-o'}`;
            } else if (!isTaken && canShowPreview) {
              cellClasses += currentPlayer === 'X' ? ' preview-x' : ' preview-o';
            }

            const ariaLabel = isTaken
              ? `Cell ${idx + 1}, ${cellValue}`
              : `Cell ${idx + 1}, empty`;

            return (
              <button
                key={idx}
                id={`cell-${idx}`}
                data-index={idx}
                className={cellClasses}
                role="gridcell"
                aria-label={ariaLabel}
                tabIndex={0}
                onClick={() => onCellClick(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                {cellValue === 'X' && (
                  <svg className="mark-x" viewBox="0 0 100 100" aria-hidden="true">
                    <line x1="22" y1="22" x2="78" y2="78" strokeWidth="12" strokeLinecap="round" />
                    <line x1="78" y1="22" x2="22" y2="78" strokeWidth="12" strokeLinecap="round" />
                  </svg>
                )}
                {cellValue === 'O' && (
                  <svg className="mark-o" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="32" strokeWidth="12" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            );
          })}

          {/* SVG Strike Through Overlay Line */}
          <svg
            className={`strike-overlay ${winningLine ? 'active' : ''}`}
            id="strikeOverlay"
            viewBox="0 0 300 300"
            aria-hidden="true"
          >
            <line
              id="strikeLine"
              x1={winningLine ? winningLine.line.x1 : 0}
              y1={winningLine ? winningLine.line.y1 : 0}
              x2={winningLine ? winningLine.line.x2 : 0}
              y2={winningLine ? winningLine.line.y2 : 0}
              className={`strike-line ${winner === 'X' ? 'x-win' : 'o-win'}`}
            />
          </svg>
        </div>
      </div>
    </main>
  );
}
