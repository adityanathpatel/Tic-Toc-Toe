/**
 * Tic-Tac-Toe Minimax AI Engine with Alpha-Beta Pruning
 * Handles optimal decision making, threat blocking, win seizing,
 * and difficulty modes (Unbeatable, Challenging, Casual).
 */

export const WINNING_COMBOS = [
  { combo: [0, 1, 2], line: { x1: 20, y1: 50, x2: 280, y2: 50 } },   // Row 0
  { combo: [3, 4, 5], line: { x1: 20, y1: 150, x2: 280, y2: 150 } }, // Row 1
  { combo: [6, 7, 8], line: { x1: 20, y1: 250, x2: 280, y2: 250 } }, // Row 2
  { combo: [0, 3, 6], line: { x1: 50, y1: 20, x2: 50, y2: 280 } },   // Col 0
  { combo: [1, 4, 7], line: { x1: 150, y1: 20, x2: 150, y2: 280 } }, // Col 1
  { combo: [2, 5, 8], line: { x1: 250, y1: 20, x2: 250, y2: 280 } }, // Col 2
  { combo: [0, 4, 8], line: { x1: 25, y1: 25, x2: 275, y2: 275 } },   // Diagonal \
  { combo: [2, 4, 6], line: { x1: 275, y1: 25, x2: 25, y2: 275 } }    // Diagonal /
];

export function checkWin(board) {
  for (let item of WINNING_COMBOS) {
    const [a, b, c] = item.combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: item.combo, line: item.line };
    }
  }
  return null;
}

export function checkDraw(board) {
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board) {
  const moves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

export function findImmediateMove(board, symbol) {
  const moves = getAvailableMoves(board);
  for (let m of moves) {
    board[m] = symbol;
    const win = checkWin(board);
    board[m] = null;
    if (win) return m;
  }
  return null;
}

function minimax(board, depth, isMaximizing, aiSymbol, humanSymbol, alpha = -Infinity, beta = Infinity) {
  const winCheck = checkWin(board);
  if (winCheck) {
    if (winCheck.winner === aiSymbol) return 10 - depth;
    if (winCheck.winner === humanSymbol) return depth - 10;
  }

  if (checkDraw(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let move of getAvailableMoves(board)) {
      board[move] = aiSymbol;
      const evaluation = minimax(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of getAvailableMoves(board)) {
      board[move] = humanSymbol;
      const evaluation = minimax(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

export function getBestMove(board, aiSymbol, humanSymbol, difficulty = 'unbeatable') {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // 1. Easy Mode: 70% random, 30% smart
  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // 2. Medium Mode: Immediate win/block, 35% random exploration
  if (difficulty === 'medium') {
    const immediateWin = findImmediateMove(board, aiSymbol);
    if (immediateWin !== null) return immediateWin;

    const immediateBlock = findImmediateMove(board, humanSymbol);
    if (immediateBlock !== null) return immediateBlock;

    if (Math.random() < 0.35) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // 3. Unbeatable Mode (Minimax with Optimal Alpha-Beta Pruning)
  // Fast Opening Optimization:
  if (availableMoves.length === 9) {
    const openings = [0, 2, 4, 6, 8];
    return openings[Math.floor(Math.random() * openings.length)];
  }

  if (availableMoves.length === 8 && board[4] === null) {
    return 4;
  }

  let bestScore = -Infinity;
  let optimalMoves = [];
  let alpha = -Infinity;
  let beta = Infinity;

  for (let move of availableMoves) {
    board[move] = aiSymbol;
    const score = minimax(board, 0, false, aiSymbol, humanSymbol, alpha, beta);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      optimalMoves = [move];
    } else if (score === bestScore) {
      optimalMoves.push(move);
    }
    alpha = Math.max(alpha, bestScore);
  }

  return optimalMoves[Math.floor(Math.random() * optimalMoves.length)];
}
