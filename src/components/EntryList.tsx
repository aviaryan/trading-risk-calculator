import type { Entry } from '../types'

interface EntryListProps {
  entries: Entry[]
  onUpdateEntry: (id: number, field: 'price' | 'investment', value: number) => void
  onRemoveEntry: (id: number) => void
  onAddEntry: () => void
}

export const EntryList = ({ entries, onUpdateEntry, onRemoveEntry, onAddEntry }: EntryListProps) => {
  return (
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
                onChange={(e) => onUpdateEntry(entry.id, 'price', parseFloat(e.target.value) || 0)}
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
                onChange={(e) => onUpdateEntry(entry.id, 'investment', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </label>
          </div>
          {entries.length > 1 && (
            <button 
              className="btn-remove" 
              onClick={() => onRemoveEntry(entry.id)}
              aria-label="Remove entry"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button className="btn-add" onClick={onAddEntry}>
        + Add Entry
      </button>
    </div>
  )
}

