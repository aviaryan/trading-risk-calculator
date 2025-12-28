interface StopLossInputProps {
  stopLoss: number
  onStopLossChange: (value: number) => void
}

export const StopLossInput = ({ stopLoss, onStopLossChange }: StopLossInputProps) => {
  return (
    <div className="section">
      <h2>Stop Loss</h2>
      <label className="stop-loss-input">
        Stop Loss Price ($)
        <input
          type="number"
          step="0.01"
          min="0"
          value={stopLoss || ''}
          onChange={(e) => onStopLossChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
      </label>
    </div>
  )
}

