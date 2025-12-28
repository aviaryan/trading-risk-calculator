export interface Entry {
  id: number
  price: number
  investment: number
}

export interface SavedTrade {
  id: string
  name: string
  entries: Entry[]
  stopLoss: number
  nextId: number
  timestamp: number
}

