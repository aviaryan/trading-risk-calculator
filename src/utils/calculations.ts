import type { Entry } from '../types'

export const calculateShares = (entry: Entry): number => {
  return entry.price > 0 ? entry.investment / entry.price : 0
}

export const calculateTotalLoss = (entries: Entry[], stopLoss: number): number => {
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

export const calculateTotalInvestment = (entries: Entry[]): number => {
  return entries.reduce((total, entry) => total + (entry.investment || 0), 0)
}

export const calculateTotalShares = (entries: Entry[]): number => {
  return entries.reduce((total, entry) => {
    return total + calculateShares(entry)
  }, 0)
}

export const calculateAverageEntry = (entries: Entry[]): number => {
  const totalInvestment = calculateTotalInvestment(entries)
  const totalShares = calculateTotalShares(entries)
  return totalShares > 0 ? totalInvestment / totalShares : 0
}

