# 🎮 Tic-Tac-Toe Master (React + Vite) | Ultimate Arena

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.2.8-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646cff.svg)](https://vite.dev/)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg?logo=vercel)](https://vercel.com/)
[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7.svg?logo=netlify)](https://www.netlify.com/)
[![Zero External Dependencies](https://img.shields.io/badge/Dependencies-Zero_External_UI_Libs-brightgreen.svg)](#technical-stack)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AA_Keyboard_Nav-purple.svg)](#accessibility--keyboard-controls)

A modern, responsive, and unbeatable **React 19** Tic-Tac-Toe web application powered by **Vite**. Built for instant **1-click deployment on Vercel or Netlify**, featuring an unbeatable **Minimax AI** (with Alpha-Beta pruning), local **2-Player (PvP)** mode, **synthesized Web Audio API sound effects**, dynamic SVG stroke animations, celebratory 2D canvas confetti, and persistent score tracking.

---

## 📸 In-Browser Application Preview

![Tic-Tac-Toe Master UI](file:///C:/Users/DeLL/.gemini/antigravity-ide/brain/58261a7b-4d93-4311-9637-26dca9d413ad/tic_tac_toe_final_verification_1792175533999.png)

---

## 📦 Manual Deployment Guide

The app builds into standard, self-contained static HTML, CSS, and JS files that can be manually deployed to any web hosting service without proprietary configuration files.

### Step 1: Create the Production Build
```bash
npm run build
```
This generates a fast, optimized production bundle inside the `dist/` directory.

### Step 2: Deploy to Your Preferred Host

- **Manual Netlify Deploy**:
  1. Log in to [app.netlify.com](https://app.netlify.com/).
  2. Navigate to the **Sites** tab and drag & drop the generated `dist/` folder directly onto the upload area.
  3. Your game is published immediately with an instant live URL.

- **Manual Vercel Deploy**:
  1. From your project terminal, run `npm run build`.
  2. Deploy the `dist` directory with `npx vercel deploy --prebuilt` or import your Git repository and set Output Directory to `dist`.

- **Any Static Host (GitHub Pages, Cloudflare Pages, AWS S3, Firebase)**:
  Upload the contents of the `dist/` folder directly to your web server or bucket root.

---

## 💻 Local Development & Build

### Prerequisites
- Node.js (v18.0 or later)
- npm or yarn or pnpm

### Quickstart Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (with hot module replacement)
npm run dev

# 3. Create optimized production build
npm run build

# 4. Preview production build locally
npm run preview

# 5. Run automated test suite
npm test
```

---

## 🌟 Highlights & Features

### 🧠 Intelligent AI (Minimax Algorithm with Alpha-Beta Pruning)
- **Unbeatable Opponent**: Employs the recursive **Minimax decision algorithm with alpha-beta pruning** and depth-weighted scoring (`+10 - depth` for AI victory, `depth - 10` for human victory).
- **Optimal Decision Making**: The AI will never miss an immediate win, never fail to block an opponent's threat, and is mathematically impossible to defeat when set to *Unbeatable*.
- **Variety in Play**: Rather than picking predictable lines, the engine randomizes among all equally optimal moves.
- **Three Selectable Difficulty Levels**:
  - `Unbeatable (Minimax)`: Absolute mathematical perfection.
  - `Challenging (Smart)`: Immediate win and block detection with 35% exploration.
  - `Casual (Easy)`: Relaxed 70% random move selection for beginners.
- **Realistic Human Pacing**: Features a ~380ms calculation delay and an active pulsing `"AI is calculating..."` status indicator.

### 👥 Player vs Player (Local 2P)
- Seamless pass-and-play on the same desktop, tablet, or smartphone.
- Clearly displays active turn indicator, dynamic role labels, and glowing player cards.

### 🎨 Modern Cyber Glassmorphic UI/UX
- **Aesthetic**: Deep slate dark theme (`#0a0e17`) with blurred ambient backdrop glows and glassmorphism (`backdrop-filter: blur(16px)`).
- **Vibrant Player Distinctions**:
  - **Player X**: Electric Cyan / Sky Blue (`#00f2fe`) with neon glow shadows.
  - **Player O**: Radiant Neon Rose / Coral (`#ff416c`) with neon glow shadows.
  - **Ties / Stalemate**: Warm Amber (`#fbbf24`).
- **Interactive Micro-Animations**:
  - Animated SVG mark drawing via CSS `stroke-dasharray` and `stroke-dashoffset`.
  - Empty cell ghost hover previews showing the current player's symbol.
  - Dynamic SVG strike-through line crossing through winning cells.
  - Pulsing winning cell halos.
  - 2D Canvas confetti particle engine on match victory.
- **Single-Viewport Layout**: Carefully calibrated responsive layout that fits naturally on any standard screen size without scrolling.

### 🔊 Zero-Asset Synthesized Audio (Web Audio API)
- Zero external MP3/WAV files to download, buffer, or fail.
- Pure mathematical audio wave synthesis:
  - Harmonic frequency chime for **X** moves.
  - Warm acoustic resonance for **O** moves.
  - Ascending 4-tone major chord arpeggio on win.
  - Mellow descending triad on ties.
  - Error buzz for clicks on occupied cells.
- Toggle sound ON/OFF with immediate state persistence.

### 💾 LocalStorage Persistence
- Match scores (**Player X wins**, **Player O wins**, **Draws**) automatically persist across browser refreshes and sessions.
- Audio preference (Muted / Unmuted) and chosen difficulty remain saved.
- One-click `"Reset Scores"` action with user confirmation.

---

## ⌨️ Accessibility & Keyboard Controls

The game is fully navigable using standard keyboard inputs and includes full screen-reader ARIA live regions:

| Key | Action |
| :--- | :--- |
| <kbd>1</kbd> – <kbd>9</kbd> | Direct move placement onto the 3×3 grid (1 = top-left, 9 = bottom-right) |
| <kbd>←</kbd> <kbd>↑</kbd> <kbd>→</kbd> <kbd>↓</kbd> | Navigate focus across the 9 board cells |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Select / play into the focused cell |
| <kbd>R</kbd> | Restart current game round |
| <kbd>M</kbd> | Toggle sound effects ON / OFF |
| <kbd>Esc</kbd> | Dismiss any open modal (Results or Rules dialog) |

---

## 📂 Project Architecture

```
├── public/
│   ├── favicon.svg          # Modern vector icon with glowing neon X and O
│   └── manifest.json        # Web App Manifest for PWA installation & metadata
├── src/
│   ├── components/
│   │   ├── ActionToolbar.jsx    # Restart Game & Reset Scores controls
│   │   ├── ControlsPanel.jsx    # Game Mode, AI Level & Side Selection pickers
│   │   ├── GameBoard.jsx        # 3x3 Grid, SVG marks, ghost previews, strike line
│   │   ├── Header.jsx           # Brand header, Sound Toggle & Help buttons
│   │   ├── HelpModal.jsx        # Rules, keyboard navigation & Minimax guide modal
│   │   ├── KeyboardHint.jsx     # Bottom keyboard legend
│   │   ├── ResultModal.jsx      # Victory/Tie modal with 2D canvas confetti
│   │   ├── ScoreBoard.jsx       # Player X, Draws, Player O cards with active glow
│   │   └── StatusIndicator.jsx  # Dynamic status chip & turn dot
│   ├── utils/
│   │   ├── confetti.js          # Canvas particle explosion engine
│   │   ├── minimax.js           # Minimax algorithm with alpha-beta pruning
│   │   └── sound.js             # Web Audio API wave synthesizer
│   ├── App.css              # Component styling, animations, responsive layout
│   ├── App.jsx              # Main React state container & keyboard event dispatcher
│   ├── index.css            # Design tokens, reset, typography & ambient glow keyframes
│   └── main.jsx             # React 19 entry point
├── test-engine.js           # Headless Node.js automated test suite (13/13 tests)
├── vite.config.js           # Vite build and plugin configuration
├── package.json             # Scripts & dependencies
├── README.md                # Project documentation
├── LICENSE                  # MIT License
└── .gitignore               # Build & environment exclusion rules
```

---

## 🧪 Automated Testing & Verification

An automated headless test suite is included in `test-engine.js` to mathematically prove game rules and AI perfection.

Run the test suite:
```bash
npm test
# or: node test-engine.js
```

### Verified Scenarios:
1. **Winning Combinations**: All 8 win trajectories (3 rows, 3 columns, 2 diagonals) verified.
2. **Draw Detection**: Full-board stalemate detection without false winners.
3. **Immediate Win Taking**: Verifies AI seizes available victory moves instantly.
4. **Immediate Threat Blocking**: Verifies AI intercepts opponent 2-in-a-row threats.
5. **Monte Carlo 200-Match Simulation**: 200 consecutive games simulated against an opportunistic opponent; verified **0 human wins** (Minimax mathematically unbeatable).

---

## 🌐 Browser Compatibility

Tested and verified compatible across all modern evergreen browsers:
- **Google Chrome** (v80+)
- **Microsoft Edge** (v80+)
- **Mozilla Firefox** (v75+)
- **Apple Safari** (iOS & macOS v14+)
- **Brave / Opera / Vivaldi**

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.
