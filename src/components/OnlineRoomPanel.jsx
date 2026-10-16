import React, { useState, useEffect } from 'react';

export default function OnlineRoomPanel({
  onlineState, // 'idle' | 'hosting' | 'joining' | 'connected'
  roomCode,
  role, // 'host' | 'guest'
  onHostRoom,
  onJoinRoom,
  onLeaveRoom,
  onSendEmote,
  incomingEmote,
  errorMessage,
  onClearError
}) {
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('host'); // 'host' | 'join'

  // Pre-fill inputCode if roomCode was provided via URL
  useEffect(() => {
    if (roomCode && onlineState === 'idle') {
      setInputCode(roomCode);
      setActiveTab('join');
    }
  }, [roomCode, onlineState]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.trim().replace(/\D/g, '').slice(0, 6);
      if (cleaned) {
        setInputCode(cleaned);
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    const clean = inputCode.trim().replace(/\D/g, '');
    if (clean.length === 6) {
      onJoinRoom(clean);
    }
  };

  return (
    <section className="online-room-panel" aria-label="Online multiplayer room">
      {/* 1. Connected State */}
      {onlineState === 'connected' ? (
        <div className="online-connected-card">
          <div className="connected-header">
            <div className="connected-status">
              <span className="online-live-dot" aria-hidden="true"></span>
              <span className="connected-title">Online Match Live</span>
              <span className="room-badge">Room #{roomCode}</span>
            </div>
            <button
              type="button"
              className="leave-btn"
              onClick={onLeaveRoom}
              title="Leave room and return to menu"
            >
              Leave Room
            </button>
          </div>

          <div className="player-assignment-pill">
            {role === 'host' ? (
              <span>You are <strong className="sym-x">Player X</strong> (Goes First) &bull; Opponent is <strong className="sym-o">Player O</strong></span>
            ) : (
              <span>You are <strong className="sym-o">Player O</strong> (Goes Second) &bull; Opponent is <strong className="sym-x">Player X</strong></span>
            )}
          </div>

          {/* Quick Reaction Emotes */}
          <div className="emote-bar" aria-label="Send reaction to opponent">
            <span className="emote-label">React:</span>
            {['🔥', '👏', '😎', '👋', '🎯', '😱'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="emote-btn"
                onClick={() => onSendEmote(emoji)}
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {incomingEmote && (
            <div className="incoming-emote-toast" key={incomingEmote.id}>
              <span>Opponent: </span>
              <span className="toast-emoji">{incomingEmote.emoji}</span>
            </div>
          )}
        </div>
      ) : (
        /* 2. Setup (Host / Join) State */
        <div className="online-setup-card">
          {/* Host / Join Tabs */}
          <div className="online-tab-group" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'host'}
              className={`online-tab ${activeTab === 'host' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('host');
                onClearError?.();
                if (onlineState !== 'hosting') {
                  onHostRoom();
                }
              }}
            >
              <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Host Game</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'join'}
              className={`online-tab ${activeTab === 'join' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('join');
                onClearError?.();
              }}
            >
              <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Join Game</span>
            </button>
          </div>

          {errorMessage && (
            <div className="online-error-banner" role="alert">
              <span>{errorMessage}</span>
              <button type="button" onClick={onClearError} className="error-close-btn">&times;</button>
            </div>
          )}

          {activeTab === 'host' ? (
            /* Host View */
            <div className="tab-panel host-panel">
              <p className="tab-subtitle">Share this 6-digit code with your friend to connect instantly:</p>
              
              <div className="code-display-box" aria-label={`Room Code ${roomCode}`}>
                {roomCode ? (
                  roomCode.split('').map((digit, i) => (
                    <span key={i} className="code-digit">{digit}</span>
                  ))
                ) : (
                  <span className="code-digit">...</span>
                )}
              </div>

              <div className="host-actions">
                <button
                  type="button"
                  className="code-action-btn primary-action"
                  onClick={handleCopyCode}
                  title="Copy 6-digit room code"
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>{copiedCode ? 'Copied Code! ✓' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  className="code-action-btn secondary-action"
                  onClick={handleCopyLink}
                  title="Copy direct invitation link"
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span>{copiedLink ? 'Link Copied! ✓' : 'Share Link'}</span>
                </button>
              </div>

              <div className="waiting-radar">
                <span className="radar-pulse" aria-hidden="true"></span>
                <span className="waiting-text">Waiting for opponent to paste code &amp; join...</span>
              </div>
            </div>
          ) : (
            /* Join View */
            <form className="tab-panel join-panel" onSubmit={handleJoinSubmit}>
              <p className="tab-subtitle">Enter the 6-digit code shared by the host:</p>
              
              <div className="join-input-wrapper">
                <input
                  type="text"
                  id="roomCodeInput"
                  className="room-code-input"
                  placeholder="e.g. 584920"
                  value={inputCode}
                  maxLength={6}
                  autoComplete="off"
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setInputCode(clean);
                    onClearError?.();
                  }}
                />
                <button
                  type="button"
                  className="paste-btn"
                  onClick={handlePasteCode}
                  title="Paste from clipboard"
                >
                  Paste
                </button>
              </div>

              <button
                type="submit"
                id="connectRoomBtn"
                className="join-submit-btn"
                disabled={inputCode.length !== 6 || onlineState === 'joining'}
              >
                {onlineState === 'joining' ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Connecting to Room #{inputCode}...</span>
                  </>
                ) : (
                  <>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span>Connect &amp; Play</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
