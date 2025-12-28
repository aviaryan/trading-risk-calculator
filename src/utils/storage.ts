import type { SavedTrade } from '../types'
import { STORAGE_KEY } from '../constants'

export const getSavedTrades = (): SavedTrade[] => {
  const tradesJson = localStorage.getItem(STORAGE_KEY)
  if (!tradesJson) return []
  try {
    return JSON.parse(tradesJson)
  } catch {
    return []
  }
}

export const saveTradeToStorage = (trade: SavedTrade): void => {
  const trades = getSavedTrades()
  trades.unshift(trade)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}

export const deleteTradeFromStorage = (id: string): void => {
  const trades = getSavedTrades()
  const filteredTrades = trades.filter(t => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrades))
}

