# 🎮 Tic-Tac-Toe Master

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vite.dev/)
[![Code of Conduct](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/Security-Policy-brightgreen.svg)](SECURITY.md)

A modern, fast, and responsive Tic-Tac-Toe web game built with **React 19** and **Vite**. Features an unbeatable **Minimax AI** (with Alpha-Beta pruning), local **2-Player (PvP)** mode, **synthesized Web Audio API sound effects**, and persistent score tracking.

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Step-by-Step Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adityanathpatel/Tic-Toc-Toe.git
   cd Tic-Toc-Toe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Open [http://localhost:5173](http://localhost:5173) in your browser to play immediately.

---

## 🛠️ Additional Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local dev server with hot module replacement (HMR) |
| `npm run build` | Builds optimized production bundle into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm test` | Runs the automated 13-test Minimax & game rules verification suite |

---

## ✨ Features

- **Game Modes**:
  - **vs Computer**: Play against AI with 3 levels (*Unbeatable Minimax*, *Challenging*, *Casual*).
  - **2 Players**: Pass-and-play on the same device.
- **Side Choice**: Play as **X** (goes first) or **O** (goes second; computer makes the opening move).
- **Audio Effects**: Built-in sound effects generated via native **Web Audio API** (no external audio files, with mute toggle).
- **Responsive & Dark UI**: Sleek glassmorphic theme with glowing neon accents and winning line animations.
- **Persistent Scores**: Tracks Player X wins, Player O wins, and Draws in `localStorage`.
- **Keyboard & Accessible**: Full keyboard support and screen reader ARIA labels.

---

## ⌨️ Controls & Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>1</kbd> – <kbd>9</kbd> | Place mark directly on board (1 = top-left, 9 = bottom-right) |
| <kbd>←</kbd> <kbd>↑</kbd> <kbd>→</kbd> <kbd>↓</kbd> | Navigate between cells |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Select focused cell |
| <kbd>R</kbd> | Restart current game |
| <kbd>M</kbd> | Toggle sound ON / OFF |
| <kbd>Esc</kbd> | Close any open modal |

---

## 📂 Project Structure

```
├── public/              # Static assets (favicon, manifest)
├── src/
│   ├── components/      # UI components (Board, ScoreBoard, Modals, Controls, etc.)
│   ├── utils/           # Minimax algorithm, Web Audio synth, canvas confetti
│   ├── App.css          # Component styling & animations
│   ├── App.jsx          # Game state & event handling
│   ├── index.css        # Design tokens & global layout
│   └── main.jsx         # React entry point
├── test-engine.js       # Headless automated test suite
├── CODE_OF_CONDUCT.md   # Community guidelines & pledge
├── CONTRIBUTING.md      # Contribution workflow & guidelines
├── SECURITY.md          # Security policy & vulnerability reporting
├── package.json         # Dependencies & scripts
└── vite.config.js       # Vite configuration
```

---

## 🔒 Security

For vulnerability disclosures and security policies, please review our [Security Policy](SECURITY.md).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 📜 Code of Conduct

We are committed to providing an open, friendly, and harassment-free environment for everyone. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
