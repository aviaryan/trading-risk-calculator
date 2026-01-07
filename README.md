# Trading Risk Calculator

![Screenshot](https://github.com/user-attachments/assets/4209b6cf-3037-40cd-8367-a0010a1eb524)

A simple and intuitive risk calculator for US stock trading. Calculate your potential loss across multiple entry positions with a single stop loss.

## Features

### Core Functionality
- **Multiple Entries**: Add as many entry positions as you need (1, 5, 10, or more)
- **Entry Details**: For each entry, specify:
  - Entry price (in USD)
  - Investment amount (in USD) - the dollar amount you're investing at this entry
- **Stop Loss**: Set a single stop loss price for all entries
- **Risk Calculation**: Automatically calculates:
  - Total investment across all entries
  - Average entry price (weighted by investment)
  - Total number of shares (calculated from price and investment)
  - **Total potential loss** if stop loss is hit

### Trade Management
- **💾 Save Trades**: Save your current trade configuration with a custom name
- **📋 Trade History**: View all your saved trades with key details
  - Investment amount
  - Number of entries
  - Stop loss price
  - Date and time saved
- **Load Saved Trades**: Load any previously saved trade back into the calculator
- **Auto-save**: Your active trade is automatically saved and restored when you return
- **🔄 New Trade**: Clear current configuration and start fresh

## How to Use

1. **Set up your trade**: Add entry positions using the "+ Add Entry" button
2. **Enter details**: For each entry, enter the entry price and dollar investment amount
3. **Set stop loss**: Enter your stop loss price
4. **View risk**: The calculator automatically shows your total potential loss
5. **Save your trade**: Click "💾 Save Trade" to save the configuration for future reference
6. **Access history**: Click "📋 History" to view, load, or delete saved trades

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (for CI)
npm run test:run
```

## Testing

This project includes a comprehensive test suite using **Vitest** and **React Testing Library**.

- **35+ tests** covering all major features
- Tests for calculations, UI interactions, and localStorage functionality
- See [TEST_README.md](./TEST_README.md) for detailed testing documentation

**Note**: If you encounter issues running tests due to Node version compatibility with jsdom, see the troubleshooting section in TEST_README.md.

## Tech Stack

- React + TypeScript + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
