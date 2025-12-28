import type { SavedTrade } from '../types'

interface HistoryModalProps {
  isOpen: boolean
  trades: SavedTrade[]
  onClose: () => void
  onLoad: (trade: SavedTrade) => void
  onDelete: (id: string) => void
}

export const HistoryModal = ({ isOpen, trades, onClose, onLoad, onDelete }: HistoryModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Trade History</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="history-list">
          {trades.length === 0 ? (
            <div className="empty-state">
              <p>No saved trades yet</p>
              <p className="empty-state-hint">Save your current trade to see it here</p>
            </div>
          ) : (
            trades.map((trade) => {
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
                      onClick={() => onLoad(trade)}
                    >
                      Load
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => onDelete(trade.id)}
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
  )
}

