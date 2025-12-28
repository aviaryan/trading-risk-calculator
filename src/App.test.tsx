import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Trading Risk Calculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Initial Render', () => {
    it('should render the app title', () => {
      render(<App />)
      expect(screen.getByText('Trading Risk Calculator')).toBeInTheDocument()
    })

    it('should render action buttons', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save trade/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /new trade/i })).toBeInTheDocument()
    })

    it('should render one entry by default', () => {
      render(<App />)
      expect(screen.getByText('Entry 1')).toBeInTheDocument()
    })

    it('should render stop loss input', () => {
      render(<App />)
      expect(screen.getByText('Stop Loss')).toBeInTheDocument()
    })

    it('should render summary section', () => {
      render(<App />)
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Potential Loss')).toBeInTheDocument()
      expect(screen.getByText('Total Investment')).toBeInTheDocument()
    })
  })

  describe('Entry Management', () => {
    it('should add a new entry when add button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      const addButton = screen.getByRole('button', { name: /add entry/i })
      await user.click(addButton)

      expect(screen.getByText('Entry 1')).toBeInTheDocument()
      expect(screen.getByText('Entry 2')).toBeInTheDocument()
    })

    it('should add multiple entries', async () => {
      const user = userEvent.setup()
      render(<App />)

      const addButton = screen.getByRole('button', { name: /add entry/i })
      await user.click(addButton)
      await user.click(addButton)
      await user.click(addButton)

      expect(screen.getByText('Entry 1')).toBeInTheDocument()
      expect(screen.getByText('Entry 2')).toBeInTheDocument()
      expect(screen.getByText('Entry 3')).toBeInTheDocument()
      expect(screen.getByText('Entry 4')).toBeInTheDocument()
    })

    it('should not show remove button when only one entry exists', () => {
      render(<App />)
      const removeButtons = screen.queryAllByRole('button', { name: /remove entry/i })
      expect(removeButtons).toHaveLength(0)
    })

    it('should remove an entry when remove button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      const addButton = screen.getByRole('button', { name: /add entry/i })
      await user.click(addButton)

      expect(screen.getByText('Entry 2')).toBeInTheDocument()

      const removeButtons = screen.getAllByRole('button', { name: /remove entry/i })
      await user.click(removeButtons[1])

      expect(screen.queryByText('Entry 2')).not.toBeInTheDocument()
      expect(screen.getByText('Entry 1')).toBeInTheDocument()
    })
  })

  describe('Calculation Tests', () => {
    it('should calculate potential loss correctly with one entry', async () => {
      const user = userEvent.setup()
      render(<App />)

      const priceInputs = screen.getAllByPlaceholderText('0.00')
      const priceInput = priceInputs[0]
      const investmentInput = priceInputs[1]
      const stopLossInput = priceInputs[2]

      await user.clear(priceInput)
      await user.type(priceInput, '100')
      await user.clear(investmentInput)
      await user.type(investmentInput, '1000')
      await user.clear(stopLossInput)
      await user.type(stopLossInput, '95')

      // Loss should be: (100 - 95) * (1000/100) = 5 * 10 = 50
      await waitFor(() => {
        expect(screen.getByText(/- \$50.00/)).toBeInTheDocument()
      })
    })

    it('should calculate potential loss correctly with multiple entries', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Add second entry
      const addButton = screen.getByRole('button', { name: /add entry/i })
      await user.click(addButton)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      
      // Entry 1: $100 price, $1000 investment (10 shares)
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '1000')
      
      // Entry 2: $110 price, $2200 investment (20 shares)
      await user.type(allInputs[2], '110')
      await user.type(allInputs[3], '2200')
      
      // Stop loss: $95
      await user.type(allInputs[4], '95')

      // Loss should be: 
      // Entry 1: (100-95) * 10 = 50
      // Entry 2: (110-95) * 20 = 300
      // Total: 350
      await waitFor(() => {
        expect(screen.getByText(/- \$350.00/)).toBeInTheDocument()
      })
    })

    it('should calculate total investment correctly', async () => {
      const user = userEvent.setup()
      render(<App />)

      const addButton = screen.getByRole('button', { name: /add entry/i })
      await user.click(addButton)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '1000')
      await user.type(allInputs[2], '110')
      await user.type(allInputs[3], '2200')

      await waitFor(() => {
        expect(screen.getByText('$3,200.00')).toBeInTheDocument()
      })
    })

    it('should calculate average entry price correctly', async () => {
      const user = userEvent.setup()
      render(<App />)

      const addButton = screen.getByRole('button', { name: /add entry/i })
      await user.click(addButton)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      
      // Entry 1: $100 price, $1000 investment (10 shares)
      // Entry 2: $110 price, $2200 investment (20 shares)
      // Average: (100*10 + 110*20) / 30 = 3200/30 = 106.67
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '1000')
      await user.type(allInputs[2], '110')
      await user.type(allInputs[3], '2200')

      await waitFor(() => {
        expect(screen.getByText('$106.67')).toBeInTheDocument()
      })
    })

    it('should calculate total shares correctly', async () => {
      const user = userEvent.setup()
      render(<App />)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      
      // $100 price, $2000 investment = 20 shares
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '2000')

      await waitFor(() => {
        expect(screen.getByText('20.00')).toBeInTheDocument()
      })
    })

    it('should handle zero values gracefully', async () => {
      render(<App />)
      
      // Should not throw errors with zero/empty values
      const zeroValues = screen.getAllByText('$0.00')
      expect(zeroValues.length).toBeGreaterThan(0)
    })
  })

  describe('Save Trade Functionality', () => {
    it('should open save dialog when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      expect(screen.getByText('Save Trade')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter trade name/i)).toBeInTheDocument()
    })

    it('should close save dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(screen.queryByText('Save Trade')).not.toBeInTheDocument()
    })

    it('should save trade to localStorage with a name', async () => {
      const user = userEvent.setup()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<App />)

      // Set some values
      const allInputs = screen.getAllByPlaceholderText('0.00')
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '1000')
      await user.type(allInputs[2], '95')

      // Open save dialog
      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      // Enter trade name
      const nameInput = screen.getByPlaceholderText(/enter trade name/i)
      await user.type(nameInput, 'AAPL Long')

      // Click save
      const saveInDialogButton = screen.getByRole('button', { name: /^save$/i })
      await user.click(saveInDialogButton)

      // Check localStorage
      const savedTrades = JSON.parse(localStorage.getItem('trading-calculator-trades') || '[]')
      expect(savedTrades).toHaveLength(1)
      expect(savedTrades[0].name).toBe('AAPL Long')
      expect(savedTrades[0].entries[0].price).toBe(100)
      expect(savedTrades[0].entries[0].investment).toBe(1000)
      expect(savedTrades[0].stopLoss).toBe(95)

      alertSpy.mockRestore()
    })

    it('should show alert if trade name is empty', async () => {
      const user = userEvent.setup()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<App />)

      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      const saveInDialogButton = screen.getByRole('button', { name: /^save$/i })
      await user.click(saveInDialogButton)

      expect(alertSpy).toHaveBeenCalledWith('Please enter a name for this trade')
      
      alertSpy.mockRestore()
    })
  })

  describe('Trade History Functionality', () => {
    it('should open history modal when history button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      const historyButton = screen.getByRole('button', { name: /history/i })
      await user.click(historyButton)

      expect(screen.getByText('Trade History')).toBeInTheDocument()
    })

    it('should show empty state when no trades are saved', async () => {
      const user = userEvent.setup()
      render(<App />)

      const historyButton = screen.getByRole('button', { name: /history/i })
      await user.click(historyButton)

      expect(screen.getByText('No saved trades yet')).toBeInTheDocument()
    })

    it('should display saved trades in history', async () => {
      const user = userEvent.setup()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<App />)

      // Save a trade first
      const allInputs = screen.getAllByPlaceholderText('0.00')
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '1000')
      await user.type(allInputs[2], '95')

      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      const nameInput = screen.getByPlaceholderText(/enter trade name/i)
      await user.type(nameInput, 'TSLA Trade')

      const saveInDialogButton = screen.getByRole('button', { name: /^save$/i })
      await user.click(saveInDialogButton)

      // Open history
      const historyButton = screen.getByRole('button', { name: /history/i })
      await user.click(historyButton)

      expect(screen.getByText('TSLA Trade')).toBeInTheDocument()
      expect(screen.getByText(/1000\.00/)).toBeInTheDocument()
      expect(screen.getByText(/1 entry/i)).toBeInTheDocument()

      alertSpy.mockRestore()
    })

    it('should load a saved trade when load button is clicked', async () => {
      const user = userEvent.setup()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<App />)

      // Save a trade
      const allInputs = screen.getAllByPlaceholderText('0.00')
      await user.type(allInputs[0], '150')
      await user.type(allInputs[1], '3000')
      await user.type(allInputs[2], '140')

      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      const nameInput = screen.getByPlaceholderText(/enter trade name/i)
      await user.type(nameInput, 'My Trade')

      const saveInDialogButton = screen.getByRole('button', { name: /^save$/i })
      await user.click(saveInDialogButton)

      // Clear current values
      const clearButton = screen.getByRole('button', { name: /new trade/i })
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      await user.click(clearButton)

      // Verify cleared
      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('0.00')
        expect(inputs[0]).toHaveValue(null)
      })

      // Open history and load
      const historyButton = screen.getByRole('button', { name: /history/i })
      await user.click(historyButton)

      const loadButton = screen.getByRole('button', { name: /load/i })
      await user.click(loadButton)

      // Verify loaded values
      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('0.00')
        expect(inputs[0]).toHaveValue(150)
        expect(inputs[1]).toHaveValue(3000)
        expect(inputs[2]).toHaveValue(140)
      })

      alertSpy.mockRestore()
      confirmSpy.mockRestore()
    })

    it('should delete a trade when delete button is clicked', async () => {
      const user = userEvent.setup()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      render(<App />)

      // Save a trade
      const saveButton = screen.getByRole('button', { name: /save trade/i })
      await user.click(saveButton)

      const nameInput = screen.getByPlaceholderText(/enter trade name/i)
      await user.type(nameInput, 'Delete Me')

      const saveInDialogButton = screen.getByRole('button', { name: /^save$/i })
      await user.click(saveInDialogButton)

      // Open history
      const historyButton = screen.getByRole('button', { name: /history/i })
      await user.click(historyButton)

      expect(screen.getByText('Delete Me')).toBeInTheDocument()

      // Delete trade
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      // Check localStorage
      const savedTrades = JSON.parse(localStorage.getItem('trading-calculator-trades') || '[]')
      expect(savedTrades).toHaveLength(0)

      alertSpy.mockRestore()
      confirmSpy.mockRestore()
    })
  })

  describe('LocalStorage Auto-save', () => {
    it('should auto-save active trade to localStorage when values change', async () => {
      const user = userEvent.setup()
      render(<App />)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      await user.type(allInputs[0], '200')
      await user.type(allInputs[1], '5000')

      await waitFor(() => {
        const activeTrade = JSON.parse(localStorage.getItem('trading-calculator-active') || '{}')
        expect(activeTrade.entries[0].price).toBe(200)
        expect(activeTrade.entries[0].investment).toBe(5000)
      })
    })

    it('should load active trade from localStorage on mount', () => {
      // Set up localStorage with a saved active trade
      const savedTrade = {
        id: 'active',
        name: 'Active Trade',
        entries: [{ id: 1, price: 125, investment: 2500 }],
        stopLoss: 120,
        nextId: 2,
        timestamp: Date.now()
      }
      localStorage.setItem('trading-calculator-active', JSON.stringify(savedTrade))

      render(<App />)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      expect(allInputs[0]).toHaveValue(125)
      expect(allInputs[1]).toHaveValue(2500)
      expect(allInputs[2]).toHaveValue(120)
    })
  })

  describe('New Trade Functionality', () => {
    it('should clear all values when new trade button is clicked with confirmation', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      render(<App />)

      // Set some values
      const allInputs = screen.getAllByPlaceholderText('0.00')
      await user.type(allInputs[0], '100')
      await user.type(allInputs[1], '1000')
      await user.type(allInputs[2], '95')

      // Click new trade
      const newTradeButton = screen.getByRole('button', { name: /new trade/i })
      await user.click(newTradeButton)

      // Verify cleared
      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('0.00')
        expect(inputs[0]).toHaveValue(null)
        expect(inputs[1]).toHaveValue(null)
        expect(inputs[2]).toHaveValue(null)
      })

      confirmSpy.mockRestore()
    })

    it('should not clear values when new trade is cancelled', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      render(<App />)

      const allInputs = screen.getAllByPlaceholderText('0.00')
      await user.type(allInputs[0], '100')

      const newTradeButton = screen.getByRole('button', { name: /new trade/i })
      await user.click(newTradeButton)

      const inputs = screen.getAllByPlaceholderText('0.00')
      expect(inputs[0]).toHaveValue(100)

      confirmSpy.mockRestore()
    })
  })
})

