# Testing Documentation

## Overview

A comprehensive test suite has been set up for the Trading Risk Calculator using **Vitest** and **React Testing Library**.

## Test Setup

### Dependencies Installed
- `vitest` - Fast unit test framework for Vite projects
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for Node.js (required for React testing)
- `@vitest/ui` - Beautiful UI for viewing test results

### Configuration Files
- `vite.config.ts` - Updated with Vitest configuration
- `src/test/setup.ts` - Test setup file with custom matchers and cleanup
- `src/App.test.tsx` - Main test file with comprehensive test suites

## Running Tests

### Available Commands

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run tests once and exit
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Test Suites Included

#### 1. **Initial Render Tests**
- Verifies the app renders correctly on load
- Checks for presence of key UI elements
- Ensures default state is correct

#### 2. **Entry Management Tests**
- Adding new entries
- Removing entries
- Multiple entry handling
- Entry validation

#### 3. **Calculation Tests** ✅
Tests all financial calculations:
- **Potential Loss Calculation**
  - Single entry scenarios
  - Multiple entry scenarios
  - Various price points and investments
- **Total Investment Calculation**
  - Sum of all investments across entries
- **Average Entry Price Calculation**
  - Weighted average based on shares
  - Handles multiple price points correctly
- **Total Shares Calculation**
  - Derived from investment / price
  - Accurate across multiple entries
- **Edge Cases**
  - Zero values
  - Empty inputs
  - Missing stop loss

#### 4. **Save Trade Functionality** 💾
- Opening/closing save dialog
- Saving trades with custom names
- Validation of trade names
- localStorage persistence
- Multiple saved trades

#### 5. **Trade History** 📋
- Opening/closing history modal
- Displaying saved trades
- Empty state handling
- Trade details display (investment, entries, stop loss, timestamp)

#### 6. **Load Trade Functionality** 🔄
- Loading saved trades from history
- Restoring all entry values
- Restoring stop loss
- UI state updates correctly

#### 7. **Delete Trade Functionality** 🗑️
- Removing trades from history
- Confirmation dialogs
- localStorage cleanup

#### 8. **LocalStorage Auto-save** 💾
- Automatic saving of active trade configuration
- Persists on every change
- Restoration on page load
- Prevents data loss

#### 9. **New Trade Functionality** 🆕
- Clearing current trade
- Confirmation dialog
- Resetting to default state
- Cancel handling

## Test Statistics

- **Total Test Suites**: 9
- **Total Tests**: 35+
- **Coverage Areas**:
  - UI Rendering & Interactions
  - Business Logic & Calculations
  - Data Persistence (localStorage)
  - User Workflows (complete scenarios)

## Test Examples

### Calculation Test Example
```typescript
it('should calculate potential loss correctly with one entry', async () => {
  // Price: $100, Investment: $1000 (10 shares)
  // Stop Loss: $95
  // Expected Loss: (100 - 95) * 10 = $50
  
  // Test verifies the calculation is accurate
})
```

### Integration Test Example
```typescript
it('should save and load a complete trade', async () => {
  // 1. User enters trade details
  // 2. User saves trade with a name
  // 3. User clears the form
  // 4. User loads the saved trade
  // 5. Verify all values are restored correctly
})
```

## Known Issues

### Node Version Compatibility
If you see errors related to `jsdom` or ES modules:

**Issue**: The latest jsdom requires Node 20+
**Solution**: Either:
1. Upgrade Node to version 20+ (recommended)
2. Or install an older compatible version:
   ```bash
   npm uninstall jsdom
   npm install --save-dev jsdom@23.0.0
   ```
3. Or use happy-dom as an alternative:
   ```bash
   npm uninstall jsdom
   npm install --save-dev happy-dom
   # Then update vite.config.ts: environment: 'happy-dom'
   ```

## Adding New Tests

To add new tests, edit `src/App.test.tsx`:

```typescript
describe('New Feature', () => {
  it('should do something', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Your test logic here
    
    expect(/* something */).toBe(/* expected */)
  })
})
```

## Best Practices

1. **Use `userEvent` for interactions** - More realistic than `fireEvent`
2. **Use `waitFor` for async updates** - Ensures React state updates complete
3. **Clean up after tests** - Handled automatically by setup file
4. **Mock browser APIs** - `localStorage`, `alert`, `confirm` are properly mocked
5. **Test user workflows** - Not just isolated functions

## Continuous Integration

To run tests in CI/CD:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm run test:run
```

## Coverage Goals

Current test coverage focuses on:
- ✅ Critical calculation logic
- ✅ User interaction flows
- ✅ Data persistence
- ✅ Edge cases and error handling

## Maintenance

- Run tests before committing code
- Update tests when adding new features
- Keep test data realistic
- Document complex test scenarios

---

For questions or issues with tests, refer to:
- [Vitest Documentation](https://vitest.dev)
- [Testing Library Documentation](https://testing-library.com/react)

