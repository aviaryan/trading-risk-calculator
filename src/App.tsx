import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Entry {
  id: number
  price: number
  investment: number
}

interface SavedTrade {
  id: string
  name: string
  entries: Entry[]
  stopLoss: number
  nextId: number
  timestamp: number
}

const STORAGE_KEY = 'trading-calculator-trades'
const ACTIVE_TRADE_KEY = 'trading-calculator-active'

function App() {
  const [entries, setEntries] = useState<Entry[]>([{ id: 1, price: 0, investment: 0 }])
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [nextId, setNextId] = useState(2)
  const [showHistory, setShowHistory] = useState(false)
  const [tradeName, setTradeName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const isInitialMount = useRef(true)

  // Load last active trade on mount
  useEffect(() => {
    const activeTradeJson = localStorage.getItem(ACTIVE_TRADE_KEY)
    if (activeTradeJson) {
      try {
        const activeTrade: SavedTrade = JSON.parse(activeTradeJson)
        setEntries(activeTrade.entries)
        setStopLoss(activeTrade.stopLoss)
        setNextId(activeTrade.nextId)
      } catch (error) {
        console.error('Failed to load active trade:', error)
      }
    }
    isInitialMount.current = false
  }, [])

  // Auto-save active trade configuration
  useEffect(() => {
    // Skip auto-save on initial mount to allow loading from localStorage first
    if (isInitialMount.current) {
      return
    }

    const activeState: SavedTrade = {
      id: 'active',
      name: 'Active Trade',
      entries,
      stopLoss,
      nextId,
      timestamp: Date.now()
    }
    localStorage.setItem(ACTIVE_TRADE_KEY, JSON.stringify(activeState))
  }, [entries, stopLoss, nextId])

  const getSavedTrades = (): SavedTrade[] => {
    const tradesJson = localStorage.getItem(STORAGE_KEY)
    if (!tradesJson) return []
    try {
      return JSON.parse(tradesJson)
    } catch {
      return []
    }
  }

  const saveTrade = () => {
    if (!tradeName.trim()) {
      alert('Please enter a name for this trade')
      return
    }

    const trades = getSavedTrades()
    const newTrade: SavedTrade = {
      id: Date.now().toString(),
      name: tradeName.trim(),
      entries,
      stopLoss,
      nextId,
      timestamp: Date.now()
    }

    trades.unshift(newTrade)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
    setTradeName('')
    setShowSaveDialog(false)
    alert('Trade saved successfully!')
  }

  const loadTrade = (trade: SavedTrade) => {
    setEntries(trade.entries)
    setStopLoss(trade.stopLoss)
    setNextId(trade.nextId)
    setShowHistory(false)
  }

  const deleteTrade = (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return
    
    const trades = getSavedTrades()
    const filteredTrades = trades.filter(t => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrades))
    setShowHistory(false)
    setTimeout(() => setShowHistory(true), 0) // Force re-render
  }

  const clearCurrentTrade = () => {
    if (!confirm('Clear current trade and start fresh?')) return
    setEntries([{ id: 1, price: 0, investment: 0 }])
    setStopLoss(0)
    setNextId(2)
  }

  const addEntry = () => {
    setEntries([...entries, { id: nextId, price: 0, investment: 0 }])
    setNextId(nextId + 1)
  }

  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id))
    }
  }

  const updateEntry = (id: number, field: 'price' | 'investment', value: number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const calculateShares = (entry: Entry) => {
    return entry.price > 0 ? entry.investment / entry.price : 0
  }

  const calculateTotalLoss = () => {
    return entries.reduce((total, entry) => {
      if (entry.price > 0 && entry.investment > 0 && stopLoss > 0) {
        const shares = calculateShares(entry)
        const lossPerShare = entry.price - stopLoss
        const entryLoss = lossPerShare * shares
        return total + entryLoss
      }
      return total
    }, 0)
  }

  const calculateTotalInvestment = () => {
    return entries.reduce((total, entry) => total + (entry.investment || 0), 0)
  }

  const calculateTotalShares = () => {
    return entries.reduce((total, entry) => {
      return total + calculateShares(entry)
    }, 0)
  }

  const calculateAverageEntry = () => {
    const totalInvestment = calculateTotalInvestment()
    const totalShares = calculateTotalShares()
    return totalShares > 0 ? totalInvestment / totalShares : 0
  }

  const totalLoss = calculateTotalLoss()
  const totalInvestment = calculateTotalInvestment()
  const totalShares = calculateTotalShares()
  const averageEntry = calculateAverageEntry()

  return (
    <div className="container">
      <div className="header">
        <h1>Trading Risk Calculator</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowHistory(true)}>
            📋 History
          </button>
          <button className="btn-secondary" onClick={() => setShowSaveDialog(true)}>
            💾 Save Trade
          </button>
          <button className="btn-secondary" onClick={clearCurrentTrade}>
            🔄 New Trade
          </button>
        </div>
      </div>

      <div className="calculator-card">
        <div className="section">
          <h2>Entries</h2>
          {entries.map((entry, index) => (
            <div key={entry.id} className="entry-row">
              <span className="entry-label">Entry {index + 1}</span>
              <div className="input-group">
                <label>
                  Price ($)
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={entry.price || ''}
                    onChange={(e) => updateEntry(entry.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </label>
                <label>
                  Investment ($)
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={entry.investment || ''}
                    onChange={(e) => updateEntry(entry.id, 'investment', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </label>
              </div>
              {entries.length > 1 && (
                <button 
                  className="btn-remove" 
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Remove entry"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="btn-add" onClick={addEntry}>
            + Add Entry
          </button>
        </div>

        <div className="section">
          <h2>Stop Loss</h2>
          <label className="stop-loss-input">
            Stop Loss Price ($)
            <input
              type="number"
              step="0.01"
              min="0"
              value={stopLoss || ''}
              onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </label>
        </div>

        <div className="results">
          <h2>Summary</h2>
          <div className="results-grid">
            <div className="result-item result-loss">
              <span className="result-label">Potential Loss</span>
              <span className="result-value loss">
                {totalLoss > 0 ? '-' : ''} ${totalLoss.toFixed(2)}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Investment</span>
              <span className="result-value">${totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Average Entry Price</span>
              <span className="result-value">${averageEntry.toFixed(2)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Shares</span>
              <span className="result-value">{totalShares.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Save Trade</h2>
            <input
              type="text"
              className="trade-name-input"
              placeholder="Enter trade name (e.g., AAPL Long)"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveTrade()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveTrade}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trade History</h2>
              <button className="btn-close" onClick={() => setShowHistory(false)}>×</button>
            </div>
            <div className="history-list">
              {getSavedTrades().length === 0 ? (
                <div className="empty-state">
                  <p>No saved trades yet</p>
                  <p className="empty-state-hint">Save your current trade to see it here</p>
                </div>
              ) : (
                getSavedTrades().map((trade) => {
                  const tradeDate = new Date(trade.timestamp)
                  const totalInv = trade.entries.reduce((sum, e) => sum + e.investment, 0)
                  
                  return (
                    <div key={trade.id} className="history-item">
                      <div className="history-item-info">
                        <h3>{trade.name}</h3>
                        <div className="history-item-details">
                          <span>💰 ${totalInv.toFixed(2)}</span>
                          <span>📊 {trade.entries.length} {trade.entries.length === 1 ? 'entry' : 'entries'}</span>
                          <span>🛡️ SL: ${trade.stopLoss.toFixed(2)}</span>
                          <span className="history-date">
                            {tradeDate.toLocaleDateString()} {tradeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="history-item-actions">
                        <button 
                          className="btn-load" 
                          onClick={() => loadTrade(trade)}
                        >
                          Load
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => deleteTrade(trade.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
