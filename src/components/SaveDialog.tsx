import { useState } from 'react'

interface SaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export const SaveDialog = ({ isOpen, onClose, onSave }: SaveDialogProps) => {
  const [tradeName, setTradeName] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    if (!tradeName.trim()) {
      alert('Please enter a name for this trade')
      return
    }
    onSave(tradeName.trim())
    setTradeName('')
  }

  const handleClose = () => {
    setTradeName('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Save Trade</h2>
        <input
          type="text"
          className="trade-name-input"
          placeholder="Enter trade name (e.g., AAPL Long)"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

