# Contributing to Tic-Tac-Toe Master

Thank you for your interest in contributing to **Tic-Tac-Toe Master**! We welcome bug reports, feature suggestions, and code contributions.

---

## 🚀 Quick Development Setup

1. **Fork & clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/Tic-Toc-Toe.git
   cd Tic-Toc-Toe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```

4. **Verify tests and production build**:
   ```bash
   npm test
   npm run build
   ```

---

## 🛠️ Contribution Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/issue-description
   ```

2. **Make your changes**:
   - Write clean, idiomatic React 19 code.
   - Maintain accessibility standards (ARIA roles, keyboard support).
   - Avoid introducing heavy external UI dependencies to keep bundle size minimal.

3. **Validate**:
   - Run `npm test` to ensure all 13 core game rules and Minimax algorithms pass.
   - Run `npm run build` to ensure the production bundle builds without errors.

4. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**:
   - Provide a concise summary of the changes.
   - Mention any related issues if applicable.

---

## 🐛 Reporting Bugs & Requesting Features

- **Bug Reports**: Open an issue detailing the steps to reproduce, expected behavior, and actual behavior.
- **Feature Requests**: Open an issue describing the proposed feature, use case, and why it adds value.

---

## 📜 Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).
