import { useState, useEffect, useRef } from 'react'
import type { Entry, SavedTrade } from '../types'
import { ACTIVE_TRADE_KEY } from '../constants'

export const useTradingCalculator = () => {
  const [entries, setEntries] = useState<Entry[]>([{ id: 1, price: 0, investment: 0 }])
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [nextId, setNextId] = useState(2)
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

  const clearTrade = () => {
    setEntries([{ id: 1, price: 0, investment: 0 }])
    setStopLoss(0)
    setNextId(2)
  }

  const loadTrade = (trade: SavedTrade) => {
    setEntries(trade.entries)
    setStopLoss(trade.stopLoss)
    setNextId(trade.nextId)
  }

  return {
    entries,
    stopLoss,
    nextId,
    setStopLoss,
    addEntry,
    removeEntry,
    updateEntry,
    clearTrade,
    loadTrade
  }
}

