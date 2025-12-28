import { useState } from 'react'
import './App.css'

interface Entry {
  id: number
  price: number
  investment: number
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([{ id: 1, price: 0, investment: 0 }])
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [nextId, setNextId] = useState(2)

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
      <h1>Trading Risk Calculator</h1>
      <p className="subtitle">Calculate your potential loss based on dollar investment across multiple entries</p>

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
            <div className="result-item highlight">
              <span className="result-label">Potential Loss</span>
              <span className="result-value loss">
                ${totalLoss.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
