interface SummaryResultsProps {
  totalLoss: number
  totalInvestment: number
  averageEntry: number
  totalShares: number
}

export const SummaryResults = ({ totalLoss, totalInvestment, averageEntry, totalShares }: SummaryResultsProps) => {
  return (
    <div className="results">
      <h2>Summary</h2>
      <div className="results-grid">
        <div className="result-item result-loss">
          <span className="result-label">Potential Loss</span>
          <span className="result-value loss">
            {totalLoss > 0 ? '-' : ''} ${totalLoss.toFixed(2)}
          </span>
        </div>
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
      </div>
    </div>
  )
}

