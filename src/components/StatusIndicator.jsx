import React from 'react';

export default function StatusIndicator({
  currentPlayer,
  isGameActive,
  isAiThinking,
  winner,
  isDraw,
  gameMode,
  humanSymbol
}) {
  let statusText = '';
  let dotClass = 'turn-dot';
  let dotStyle = {};

  const getDisplayName = (symbol) => {
    if (gameMode === 'pvc') {
      return symbol === humanSymbol ? 'You' : 'Computer';
    }
    return symbol === 'X' ? 'Player 1 (X)' : 'Player 2 (O)';
  };

  if (!isGameActive) {
    if (winner) {
      const winnerName = getDisplayName(winner);
      statusText = `${winnerName} Wins!`;
      dotStyle = { background: winner === 'X' ? 'var(--x-primary)' : 'var(--o-primary)' };
    } else if (isDraw) {
      statusText = "It's a Draw!";
      dotStyle = { background: 'var(--tie-primary)' };
    }
  } else {
    const playerName = getDisplayName(currentPlayer);
    if (currentPlayer === 'O') {
      dotClass += ' o-turn';
    }

    if (isAiThinking) {
      dotClass += ' thinking';
      statusText = `${playerName} is calculating...`;
    } else {
      statusText = `${playerName}'s Turn (${currentPlayer})`;
    }
  }

  return (
    <div className="status-indicator-bar" aria-live="polite">
      <div className="status-chip" id="statusChip" aria-label={statusText}>
        <span className={dotClass} style={dotStyle} id="turnDot"></span>
        <span className="status-text" id="statusText">{statusText}</span>
      </div>
    </div>
  );
}
