import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import ScoreBoard from './components/ScoreBoard';
import StatusIndicator from './components/StatusIndicator';
import GameBoard from './components/GameBoard';
import ActionToolbar from './components/ActionToolbar';
import KeyboardHint from './components/KeyboardHint';
import ResultModal from './components/ResultModal';
import HelpModal from './components/HelpModal';
import { checkWin, checkDraw, getBestMove } from './utils/minimax';
import { sound } from './utils/sound';
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

  // Keep a ref to board and active state for AI closure stability
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
    setBoard(prevBoard => {
      if (prevBoard[index] !== null) return prevBoard;
      const nextBoard = [...prevBoard];
      nextBoard[index] = player;
      boardRef.current = nextBoard; // Synchronously update ref

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
        return nextBoard;
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
        return nextBoard;
      }

      // Switch turn
      setCurrentPlayer(player === 'X' ? 'O' : 'X');
      return nextBoard;
    });
  }, []);

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

    executeMove(index, currentPlayer);
  }, [gameMode, currentPlayer, humanSymbol, isAiThinking, executeMove]);

  // AI Turn Trigger Effect
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
      setGameMode(newMode);
      localStorage.setItem(STORAGE_KEY_MODE, newMode);
      sound.playClick();
      startRound(humanSymbol, newMode);
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
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.enabled = nextVal;
    localStorage.setItem(STORAGE_KEY_SOUND, nextVal ? 'true' : 'false');
    if (nextVal) sound.playClick();
  };

  // Reset scores handler
  const handleResetScores = useCallback(() => {
    const reset = { X: 0, O: 0, ties: 0 };
    setScores(reset);
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(reset));
    } catch (e) {
      console.error('Failed to reset scores in localStorage', e);
    }
    sound.playClick();
  }, []);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

      if (e.key === 'Escape') {
        setIsResultModalOpen(false);
        setIsHelpModalOpen(false);
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        sound.playClick();
        startRound();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleSound();
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        e.preventDefault();
        handleCellClick(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startRound, handleToggleSound, handleCellClick]);

  return (
    <>
      <div className="app-background">
        <div className="ambient-glow glow-1" aria-hidden="true"></div>
        <div className="ambient-glow glow-2" aria-hidden="true"></div>
      </div>

      <div className="app-container">
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenHelp={() => {
            sound.playClick();
            setIsHelpModalOpen(true);
          }}
        />

        <ControlsPanel
          gameMode={gameMode}
          onModeChange={handleModeChange}
          aiDifficulty={aiDifficulty}
          onDifficultyChange={handleDifficultyChange}
          humanSymbol={humanSymbol}
          onSymbolChange={handleSymbolChange}
        />

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
            startRound();
          }}
          onResetScores={handleResetScores}
        />

        <KeyboardHint />
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
