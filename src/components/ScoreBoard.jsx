import React from 'react';

export default function ScoreBoard({
  scores,
  currentPlayer,
  isGameActive,
  gameMode,
  humanSymbol
}) {
  const isXTurn = currentPlayer === 'X' && isGameActive;
  const isOTurn = currentPlayer === 'O' && isGameActive;

  let xName = 'Player 1';
  let xRole = 'Plays X';
  let oName = 'Player 2';
  let oRole = 'Plays O';

  if (gameMode === 'online') {
    if (humanSymbol === 'X') {
      xName = 'You';
      xRole = 'Host (X)';
      oName = 'Opponent';
      oRole = 'Guest (O)';
    } else {
      xName = 'Opponent';
      xRole = 'Host (X)';
      oName = 'You';
      oRole = 'Guest (O)';
    }
  } else if (gameMode === 'pvc') {
    if (humanSymbol === 'X') {
      xName = 'Player X';
      xRole = 'You';
      oName = 'Computer';
      oRole = 'AI';
    } else {
      xName = 'Computer';
      xRole = 'AI';
      oName = 'Player O';
      oRole = 'You';
    }
  }

  return (
    <section className="score-board" aria-label="Score board">
      {/* Player X Card */}
      <div className={`score-card player-x-card ${isXTurn ? 'active-turn' : ''}`} id="cardPlayerX">
        <div className="player-meta">
          <span className="player-badge x-badge">X</span>
          <div className="player-titles">
            <span className="player-name" id="namePlayerX">{xName}</span>
            <span className="player-role" id="rolePlayerX">{xRole}</span>
          </div>
        </div>
        <div className="score-value" id="scoreX" aria-label="Player X Score">{scores.X}</div>
      </div>

      {/* Tie Card */}
      <div className="score-card tie-card" id="cardTies">
        <div className="player-meta">
          <span className="player-badge tie-badge">VS</span>
          <div className="player-titles">
            <span className="player-name">Draws</span>
            <span className="player-role">Ties</span>
          </div>
        </div>
        <div className="score-value" id="scoreTies" aria-label="Draws Count">{scores.ties}</div>
      </div>

      {/* Player O Card */}
      <div className={`score-card player-o-card ${isOTurn ? 'active-turn' : ''}`} id="cardPlayerO">
        <div className="player-meta">
          <span className="player-badge o-badge">O</span>
          <div className="player-titles">
            <span className="player-name" id="namePlayerO">{oName}</span>
            <span className="player-role" id="rolePlayerO">{oRole}</span>
          </div>
        </div>
        <div className="score-value" id="scoreO" aria-label="Player O Score">{scores.O}</div>
      </div>
    </section>
  );
}
