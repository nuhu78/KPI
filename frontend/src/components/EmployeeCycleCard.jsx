import ProgressBar from './ProgressBar'

function daysRemaining(endDate) {
  const end = new Date(`${endDate}T00:00:00`)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
}

export default function EmployeeCycleCard({
  cycle,
  marking,
  undoing,
  onMarkComplete,
  onUndo,
}) {
  if (!cycle) {
    return <p className="empty">No active cycle assigned yet.</p>
  }

  const pct = Math.min(
    100,
    Math.round((cycle.completed_files / cycle.target_files) * 100),
  )
  const atTarget = cycle.completed_files >= cycle.target_files
  const canUndo = cycle.completed_files > 0

  return (
    <div className="cycle-card">
      <h3>Current Cycle</h3>
      <div className="cycle-meta">
        <span>Target: {cycle.target_files} files</span>
        <span>Completed: {cycle.completed_files}</span>
        <span>Days left: {Math.max(0, daysRemaining(cycle.end_date))}</span>
      </div>
      <div className="cycle-progress">
        <ProgressBar value={pct} />
        <span className="cycle-score">{pct}%</span>
      </div>
      <div className="cycle-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onMarkComplete}
          disabled={marking || undoing || atTarget}
        >
          {atTarget
            ? 'Target reached'
            : marking
              ? 'Updating…'
              : 'Mark file complete'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={onUndo}
          disabled={marking || undoing || !canUndo}
        >
          {undoing ? 'Undoing…' : 'Undo last'}
        </button>
      </div>
      {canUndo && <p className="cycle-hint">Accidentally marked? Use “Undo last”.</p>}
      <p className="cycle-dates">
        {cycle.start_date} → {cycle.end_date}
      </p>
    </div>
  )
}
