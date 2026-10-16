import React from 'react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      id="helpModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="helpHeading"
      onClick={(e) => {
        if (e.target.id === 'helpModal') onClose();
      }}
    >
      <div className="modal-card help-modal-card">
        <div className="help-header">
          <h2 id="helpHeading">How to Play &amp; Controls</h2>
          <button
            id="closeHelpBtn"
            className="close-icon-btn"
            aria-label="Close rules modal"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="help-body">
          <section className="help-section">
            <h3>Game Rules</h3>
            <ul>
              <li>Players take turns placing their mark (<strong>X</strong> or <strong>O</strong>) in an empty cell.</li>
              <li><strong>X always moves first.</strong> In AI mode, if you pick O, the computer makes the first move.</li>
              <li>Get <strong>3 of your marks in a row</strong> (horizontally, vertically, or diagonally) to win.</li>
              <li>If all 9 cells are filled and no player has 3 in a row, the match is declared a <strong>Draw</strong>.</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>Unbeatable AI (Minimax)</h3>
            <p>
              The <em>Unbeatable</em> difficulty employs the recursive <strong>Minimax decision algorithm</strong> with alpha-beta pruning. It simulates all possible future moves to ensure optimal defense and attack. It is mathematically impossible to defeat—can you earn a draw?
            </p>
          </section>

          <section className="help-section">
            <h3>Accessibility &amp; Keyboard Shortcuts</h3>
            <div className="shortcuts-grid">
              <div className="shortcut-item"><kbd>1</kbd> - <kbd>9</kbd><span>Direct move on grid (1=top-left, 9=bottom-right)</span></div>
              <div className="shortcut-item"><kbd>Arrow Keys</kbd><span>Move focus across cells</span></div>
              <div className="shortcut-item"><kbd>Enter</kbd> / <kbd>Space</kbd><span>Select focused cell</span></div>
              <div className="shortcut-item"><kbd>R</kbd><span>Restart current game</span></div>
              <div className="shortcut-item"><kbd>M</kbd><span>Toggle sound effects ON/OFF</span></div>
              <div className="shortcut-item"><kbd>Esc</kbd><span>Close any open modal</span></div>
            </div>
          </section>
        </div>

        <div className="help-footer">
          <button id="gotItBtn" className="modal-btn confirm-btn" onClick={onClose} autoFocus>
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
