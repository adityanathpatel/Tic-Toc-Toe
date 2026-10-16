import React from 'react';

export default function Footer({ onOpenHelp }) {
  return (
    <footer className="app-footer">
      {/* Keyboard Shortcuts Hint Bar */}
      <div className="keyboard-hint" aria-hidden="true">
        <span><kbd>1</kbd>-<kbd>9</kbd> Place Move</span>
        <span><kbd>&larr;&uarr;&darr;&rarr;</kbd> Navigate</span>
        <span><kbd>R</kbd> Restart</span>
        <span><kbd>M</kbd> Mute</span>
      </div>

      {/* Main Footer Container */}
      <div className="footer-content">
        <div className="footer-credits">
          <span>Made with</span>
          <span className="heart-icon" aria-label="love">❤️</span>
          <span>by</span>
          <a
            href="https://github.com/adityanathpatel"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
            title="Visit Aditya Nath Patel's GitHub profile"
          >
            Aditya Nath Patel
          </a>
        </div>

        <div className="footer-links">
          <a
            href="https://tic-tac-toe-by-aadi.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link-pill"
            title="Open Live App on Netlify"
          >
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Live Demo</span>
          </a>

          <a
            href="https://github.com/adityanathpatel/Tic-Toc-Toe"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link-pill"
            title="Star repository on GitHub"
          >
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>

          <button
            type="button"
            className="footer-link-pill help-pill"
            onClick={onOpenHelp}
            title="View Rules and Controls"
          >
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Rules</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
