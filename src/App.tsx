import { useState } from 'react'
import './App.css'
import type { SavedTrade } from './types'
import { useTradingCalculator } from './hooks/useTradingCalculator'
import {
  calculateTotalLoss,
  calculateTotalInvestment,
  calculateTotalShares,
  calculateAverageEntry
} from './utils/calculations'
import { getSavedTrades, saveTradeToStorage, deleteTradeFromStorage } from './utils/storage'
import { EntryList } from './components/EntryList'
import { StopLossInput } from './components/StopLossInput'
import { SummaryResults } from './components/SummaryResults'
import { SaveDialog } from './components/SaveDialog'
import { HistoryModal } from './components/HistoryModal'

function App() {
  const {
    entries,
    stopLoss,
    setStopLoss,
    addEntry,
    removeEntry,
    updateEntry,
    clearTrade,
    loadTrade
  } = useTradingCalculator()

  const [showHistory, setShowHistory] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const handleSaveTrade = (name: string) => {
    const newTrade: SavedTrade = {
      id: Date.now().toString(),
      name,
      entries,
      stopLoss,
      nextId: entries.length + 1,
      timestamp: Date.now()
    }

    saveTradeToStorage(newTrade)
    setShowSaveDialog(false)
    alert('Trade saved successfully!')
  }

  const handleLoadTrade = (trade: SavedTrade) => {
    loadTrade(trade)
    setShowHistory(false)
  }

  const handleDeleteTrade = (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return
    
    deleteTradeFromStorage(id)
    setShowHistory(false)
    setTimeout(() => setShowHistory(true), 0) // Force re-render
  }

  const handleClearCurrentTrade = () => {
    if (!confirm('Clear current trade and start fresh?')) return
    clearTrade()
  }

  const totalLoss = calculateTotalLoss(entries, stopLoss)
  const totalInvestment = calculateTotalInvestment(entries)
  const totalShares = calculateTotalShares(entries)
  const averageEntry = calculateAverageEntry(entries)

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
          <button className="btn-secondary" onClick={handleClearCurrentTrade}>
            🔄 New Trade
          </button>
        </div>
      </div>

      <div className="calculator-card">
        <EntryList
          entries={entries}
          onUpdateEntry={updateEntry}
          onRemoveEntry={removeEntry}
          onAddEntry={addEntry}
        />

        <StopLossInput
          stopLoss={stopLoss}
          onStopLossChange={setStopLoss}
        />

        <SummaryResults
          totalLoss={totalLoss}
          totalInvestment={totalInvestment}
          averageEntry={averageEntry}
          totalShares={totalShares}
        />
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveTrade}
      />

      <HistoryModal
        isOpen={showHistory}
        trades={getSavedTrades()}
        onClose={() => setShowHistory(false)}
        onLoad={handleLoadTrade}
        onDelete={handleDeleteTrade}
      />
    </div>
  )
}

export default App
