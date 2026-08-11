import { useState } from 'react'
import { api } from '../api/client'
import ProgressBar from './ProgressBar'
import RankingTable from './RankingTable'

export default function SectionAccordion({ sections }) {
  const [expandedId, setExpandedId] = useState(null)
  const [employeesById, setEmployeesById] = useState({})
  const [loadingId, setLoadingId] = useState(null)

  const toggle = async (id) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (employeesById[id]) return
    setLoadingId(id)
    try {
      const { data } = await api.get(`/dashboard/sections/${id}/employees`)
      setEmployeesById((prev) => ({ ...prev, [id]: data }))
    } finally {
      setLoadingId(null)
    }
  }

  if (!sections || sections.length === 0) {
    return <p className="empty">No sections with active cycles yet</p>
  }

  return (
    <div className="section-accordion">
      {sections.map((section, index) => {
        const isOpen = expandedId === section.id
        return (
          <div key={section.id} className={`section-row ${isOpen ? 'open' : ''}`}>
            <button type="button" className="section-header" onClick={() => toggle(section.id)}>
              <span className="col-rank">{index + 1}</span>
              <span className="col-name">{section.name}</span>
              <span className="col-count">
                {section.employee_count} employee{section.employee_count === 1 ? '' : 's'}
              </span>
              <span className="col-score">{Number(section.average_score).toFixed(2)}%</span>
              <span className="col-progress">
                <ProgressBar value={section.average_score} />
              </span>
              <span className="col-chevron">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="section-body">
                {loadingId === section.id ? (
                  <p className="empty">Loading…</p>
                ) : (
                  <RankingTable rows={employeesById[section.id] ?? []} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
