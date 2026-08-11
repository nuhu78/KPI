import { getImageUrl } from '../api/client'
import ProgressBar from './ProgressBar'

export default function RankingTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p className="empty">No active cycles yet</p>
  }

  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th className="col-rank">Rank</th>
          <th className="col-photo"></th>
          <th className="col-name">Name</th>
          <th className="col-section">Section</th>
          <th className="col-score">Score</th>
          <th className="col-progress">Progress</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id} className={index < 3 ? 'top-three' : ''}>
            <td className="col-rank">{index + 1}</td>
            <td className="col-photo">
              {row.image_url ? (
                <img className="avatar" src={getImageUrl(row.image_url)} alt={row.name} />
              ) : (
                <span className="avatar avatar-placeholder" />
              )}
            </td>
            <td className="col-name">{row.name}</td>
            <td className="col-section">{row.section_name}</td>
            <td className="col-score">{Number(row.score).toFixed(2)}%</td>
            <td className="col-progress">
              <ProgressBar value={row.score} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
