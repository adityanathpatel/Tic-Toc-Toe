import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import ScoreBoard from './components/ScoreBoard';
import StatusIndicator from './components/StatusIndicator';
import GameBoard from './components/GameBoard';
import ActionToolbar from './components/ActionToolbar';
import OnlineRoomPanel from './components/OnlineRoomPanel';
import Footer from './components/Footer';
import ResultModal from './components/ResultModal';
import HelpModal from './components/HelpModal';
import { checkWin, checkDraw, getBestMove } from './utils/minimax';
import { sound } from './utils/sound';
import { OnlineSession, generateRoomCode } from './utils/online';
import './App.css';

const STORAGE_KEY_SCORES = 'ttt_react_scores_v1';
const STORAGE_KEY_SOUND = 'ttt_react_sound_v1';
const STORAGE_KEY_DIFFICULTY = 'ttt_react_difficulty_v1';
const STORAGE_KEY_MODE = 'ttt_react_mode_v1';

export default function App() {
  // Game Configuration State
  const [gameMode, setGameMode] = useState(() => localStorage.getItem(STORAGE_KEY_MODE) || 'pvc');
  const [aiDifficulty, setAiDifficulty] = useState(() => localStorage.getItem(STORAGE_KEY_DIFFICULTY) || 'unbeatable');
  const [humanSymbol, setHumanSymbol] = useState('X');
  const aiSymbol = humanSymbol === 'X' ? 'O' : 'X';

  // Online Multiplayer State
  const [onlineState, setOnlineState] = useState('idle'); // 'idle' | 'hosting' | 'joining' | 'connected'
  const [roomCode, setRoomCode] = useState('');
  const [onlineRole, setOnlineRole] = useState(null); // 'host' | 'guest'
  const [incomingEmote, setIncomingEmote] = useState(null);
  const [onlineErrorMessage, setOnlineErrorMessage] = useState('');
  const onlineSessionRef = useRef(null);

  // Game Board & Play State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [isGameActive, setIsGameActive] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Scores State
  const [scores, setScores] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCORES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.X === 'number' && typeof parsed.O === 'number' && typeof parsed.ties === 'number') {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return { X: 0, O: 0, ties: 0 };
  });

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SOUND);
    const enabled = stored !== 'false';
    sound.enabled = enabled;
    return enabled;
  });

  // Modal Dialogs State
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Keep a ref to board and active state for AI and P2P closure stability
  const boardRef = useRef(board);
  boardRef.current = board;
  const isGameActiveRef = useRef(isGameActive);
  isGameActiveRef.current = isGameActive;

  // Persist scores
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
    } catch (e) {
      console.error('Error persisting scores:', e);
    }
  }, [scores]);

  // Restart Round
  const startRound = useCallback((startingSymbol = humanSymbol, mode = gameMode) => {
    const emptyBoard = Array(9).fill(null);
    boardRef.current = emptyBoard;
    isGameActiveRef.current = true;
    setBoard(emptyBoard);
    setCurrentPlayer('X');
    setIsGameActive(true);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setIsAiThinking(false);
    setIsResultModalOpen(false);
  }, [humanSymbol, gameMode]);

  // Execute a valid move
  const executeMove = useCallback((index, player) => {
    if (boardRef.current[index] !== null || !isGameActiveRef.current) return;

    const nextBoard = [...boardRef.current];
    nextBoard[index] = player;
    boardRef.current = nextBoard;
    setBoard(nextBoard);

    sound.playMove(player);

    const winResult = checkWin(nextBoard);
    if (winResult) {
      setWinner(player);
      setWinningLine(winResult);
      setIsGameActive(false);
      isGameActiveRef.current = false;

      setScores(prev => ({
        ...prev,
        [player]: prev[player] + 1
      }));

      sound.playWin();
      setTimeout(() => {
        setIsResultModalOpen(true);
      }, 500);
      return;
    }

    if (checkDraw(nextBoard)) {
      setIsDraw(true);
      setIsGameActive(false);
      isGameActiveRef.current = false;

      setScores(prev => ({
        ...prev,
        ties: prev.ties + 1
      }));

      sound.playTie();
      setTimeout(() => {
        setIsResultModalOpen(true);
      }, 450);
      return;
    }

    // Switch turn
    setCurrentPlayer(player === 'X' ? 'O' : 'X');
  }, []);

  // Handle Online P2P Messages
  const handleOnlineMessage = useCallback((msg) => {
    if (!msg || typeof msg !== 'object') return;

    if (msg.type === 'MOVE') {
      if (isGameActiveRef.current && boardRef.current[msg.index] === null) {
        executeMove(msg.index, msg.symbol);
      }
    } else if (msg.type === 'RESTART') {
      startRound('X', 'online');
      sound.playClick();
    } else if (msg.type === 'RESET_SCORES') {
      setScores({ X: 0, O: 0, ties: 0 });
      try {
        localStorage.removeItem(STORAGE_KEY_SCORES);
      } catch {}
      sound.playClick();
    } else if (msg.type === 'EMOTE') {
      setIncomingEmote({ id: Date.now(), emoji: msg.emoji });
      sound.playTone(600, 'sine', 0.1, 0.15);
      setTimeout(() => setIncomingEmote(null), 3500);
    }
  }, [executeMove, startRound]);

  // Host Online Room
  const handleHostRoom = useCallback(() => {
    if (onlineSessionRef.current) {
      onlineSessionRef.current.destroy();
      onlineSessionRef.current = null;
    }

    const newCode = generateRoomCode();
    setRoomCode(newCode);
    setOnlineRole('host');
    setHumanSymbol('X');
    setOnlineState('hosting');
    setOnlineErrorMessage('');

    onlineSessionRef.current = new OnlineSession({
      role: 'host',
      roomCode: newCode,
      onConnected: () => {
        setOnlineState('connected');
        setOnlineErrorMessage('');
        sound.playClick();
        startRound('X', 'online');
      },
      onDisconnected: () => {
        setOnlineState('hosting');
        setOnlineErrorMessage('Opponent disconnected. Waiting for a player to rejoin...');
      },
      onMessage: handleOnlineMessage,
      onError: (err) => {
        setOnlineErrorMessage(err);
      }
    });
  }, [handleOnlineMessage, startRound]);

  // Join Online Room
  const handleJoinRoom = useCallback((code) => {
    if (onlineSessionRef.current) {
      onlineSessionRef.current.destroy();
      onlineSessionRef.current = null;
    }

    setRoomCode(code);
    setOnlineRole('guest');
    setHumanSymbol('O');
    setOnlineState('joining');
    setOnlineErrorMessage('');

    onlineSessionRef.current = new OnlineSession({
      role: 'guest',
      roomCode: code,
      onConnected: () => {
        setOnlineState('connected');
        setOnlineErrorMessage('');
        sound.playClick();
        startRound('X', 'online');
      },
      onDisconnected: () => {
        setOnlineState('idle');
        setOnlineErrorMessage('Disconnected from host.');
      },
      onMessage: handleOnlineMessage,
      onError: (err) => {
        setOnlineState('idle');
        setOnlineErrorMessage(err);
      }
    });
  }, [handleOnlineMessage, startRound]);

  // Leave Online Room
  const handleLeaveRoom = useCallback(() => {
    if (onlineSessionRef.current) {
      onlineSessionRef.current.destroy();
      onlineSessionRef.current = null;
    }
    setOnlineState('idle');
    setRoomCode('');
    setOnlineRole(null);
    setOnlineErrorMessage('');
    startRound('X', 'pvc');
    setGameMode('pvc');
  }, [startRound]);

  // Send Emote to Opponent
  const handleSendEmote = useCallback((emoji) => {
    if (onlineSessionRef.current && onlineState === 'connected') {
      onlineSessionRef.current.send({ type: 'EMOTE', emoji });
      sound.playTone(800, 'sine', 0.08, 0.12);
    }
  }, [onlineState]);

  // Handle cell interaction
  const handleCellClick = useCallback((index) => {
    if (!isGameActiveRef.current) {
      sound.playError();
      return;
    }

    if (boardRef.current[index] !== null) {
      sound.playError();
      return;
    }

    if (gameMode === 'pvc' && (currentPlayer !== humanSymbol || isAiThinking)) {
      return;
    }

    if (gameMode === 'online') {
      if (onlineState !== 'connected') {
        sound.playError();
        return;
      }
      if (currentPlayer !== humanSymbol) {
        sound.playError();
        return;
      }
      onlineSessionRef.current?.send({
        type: 'MOVE',
        index,
        symbol: humanSymbol
      });
    }

    executeMove(index, currentPlayer);
  }, [gameMode, onlineState, currentPlayer, humanSymbol, isAiThinking, executeMove]);

  // Check room query parameter from URL on load (e.g. ?room=584920)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam && /^\d{6}$/.test(roomParam)) {
        setGameMode('online');
        setRoomCode(roomParam);
        setOnlineState('idle');
      }
    } catch {}
  }, []);

  // Cleanup online session on unmount
  useEffect(() => {
    return () => {
      if (onlineSessionRef.current) {
        onlineSessionRef.current.destroy();
      }
    };
  }, []);

  // AI Turn Trigger Effect (only in PvC)
  useEffect(() => {
    if (
      gameMode === 'pvc' &&
      currentPlayer === aiSymbol &&
      isGameActive &&
      !winner &&
      !isDraw
    ) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        if (!isGameActiveRef.current) {
          setIsAiThinking(false);
          return;
        }

        const currentBoard = boardRef.current;
        const bestIndex = getBestMove(currentBoard, aiSymbol, humanSymbol, aiDifficulty);
        setIsAiThinking(false);
        if (bestIndex !== -1 && bestIndex !== null) {
          executeMove(bestIndex, aiSymbol);
        }
      }, 250);

      return () => {
        clearTimeout(timer);
        setIsAiThinking(false);
      };
    } else {
      setIsAiThinking(false);
    }
  }, [gameMode, currentPlayer, aiSymbol, humanSymbol, aiDifficulty, isGameActive, winner, isDraw, executeMove]);

  // Mode change handler
  const handleModeChange = (newMode) => {
    if (newMode !== gameMode) {
      if (gameMode === 'online' && onlineSessionRef.current) {
        onlineSessionRef.current.destroy();
        onlineSessionRef.current = null;
        setOnlineState('idle');
      }

      setGameMode(newMode);
      localStorage.setItem(STORAGE_KEY_MODE, newMode);
      sound.playClick();

      if (newMode === 'online') {
        if (!roomCode) {
          handleHostRoom();
        }
      } else {
        startRound(humanSymbol, newMode);
      }
    }
  };

  // AI Difficulty change handler
  const handleDifficultyChange = (newDiff) => {
    setAiDifficulty(newDiff);
    localStorage.setItem(STORAGE_KEY_DIFFICULTY, newDiff);
    sound.playClick();
  };

  // Human Symbol change handler
  const handleSymbolChange = (newSymbol) => {
    if (newSymbol !== humanSymbol) {
      setHumanSymbol(newSymbol);
      sound.playClick();
      startRound(newSymbol, gameMode);
    }
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      sound.enabled = next;
      localStorage.setItem(STORAGE_KEY_SOUND, String(next));
      if (next) sound.playClick();
      return next;
    });
  };

  // Reset scores handler
  const handleResetScores = () => {
    sound.playClick();
    setScores({ X: 0, O: 0, ties: 0 });
    try {
      localStorage.removeItem(STORAGE_KEY_SCORES);
    } catch {}

    if (gameMode === 'online' && onlineSessionRef.current) {
      onlineSessionRef.current.send({ type: 'RESET_SCORES' });
    }
  };

  // Global Keyboard Navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }

      // Close modal on Esc
      if (e.key === 'Escape') {
        if (isResultModalOpen) setIsResultModalOpen(false);
        if (isHelpModalOpen) setIsHelpModalOpen(false);
        return;
      }

      // Restart on 'r' or 'R'
      if (e.key === 'r' || e.key === 'R') {
        if (isGameActive && !isAiThinking) {
          sound.playClick();
          if (gameMode === 'online' && onlineSessionRef.current) {
            onlineSessionRef.current.send({ type: 'RESTART' });
          }
          startRound();
        }
        return;
      }

      // Sound mute toggle on 'm' or 'M'
      if (e.key === 'm' || e.key === 'M') {
        handleToggleSound();
        return;
      }

      // 1-9 direct cell placement
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const cellIndex = num - 1;
        handleCellClick(cellIndex);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isResultModalOpen, isHelpModalOpen, isGameActive, isAiThinking, handleCellClick, startRound, gameMode]);

  return (
    <>
      <div className="app-background" aria-hidden="true">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
      </div>

      <div className="app-container">
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenHelp={() => setIsHelpModalOpen(true)}
        />

        <ControlsPanel
          gameMode={gameMode}
          onModeChange={handleModeChange}
          aiDifficulty={aiDifficulty}
          onDifficultyChange={handleDifficultyChange}
          humanSymbol={humanSymbol}
          onSymbolChange={handleSymbolChange}
        />

        {/* Online Room Management Panel */}
        {gameMode === 'online' && (
          <OnlineRoomPanel
            onlineState={onlineState}
            roomCode={roomCode}
            role={onlineRole}
            onHostRoom={handleHostRoom}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
            onSendEmote={handleSendEmote}
            incomingEmote={incomingEmote}
            errorMessage={onlineErrorMessage}
            onClearError={() => setOnlineErrorMessage('')}
          />
        )}

        {/* Board and gameplay elements (visible in local modes OR when connected online) */}
        {(gameMode !== 'online' || onlineState === 'connected') && (
          <>
            <ScoreBoard
              scores={scores}
              currentPlayer={currentPlayer}
              isGameActive={isGameActive}
              gameMode={gameMode}
              humanSymbol={humanSymbol}
            />

            <StatusIndicator
              currentPlayer={currentPlayer}
              isGameActive={isGameActive}
              isAiThinking={isAiThinking}
              winner={winner}
              isDraw={isDraw}
              gameMode={gameMode}
              humanSymbol={humanSymbol}
            />

            <GameBoard
              board={board}
              onCellClick={handleCellClick}
              winningLine={winningLine}
              winner={winner}
              currentPlayer={currentPlayer}
              isGameActive={isGameActive}
              gameMode={gameMode}
              humanSymbol={humanSymbol}
              isAiThinking={isAiThinking}
            />

            <ActionToolbar
              onRestart={() => {
                sound.playClick();
                if (gameMode === 'online' && onlineSessionRef.current) {
                  onlineSessionRef.current.send({ type: 'RESTART' });
                }
                startRound();
              }}
              onResetScores={handleResetScores}
            />
          </>
        )}

        <Footer onOpenHelp={() => setIsHelpModalOpen(true)} />
      </div>

      <ResultModal
        isOpen={isResultModalOpen}
        winner={winner}
        isDraw={isDraw}
        scores={scores}
        gameMode={gameMode}
        humanSymbol={humanSymbol}
        onPlayAgain={() => {
          sound.playClick();
          if (gameMode === 'online' && onlineSessionRef.current) {
            onlineSessionRef.current.send({ type: 'RESTART' });
          }
          startRound();
        }}
        onClose={() => setIsResultModalOpen(false)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
}
