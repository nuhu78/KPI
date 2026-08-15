import { useCallback, useEffect, useState } from 'react'
import { api, getErrorMessage } from '../api/client'
import ProgressBar from './ProgressBar'

const EMPTY_SINGLE = { employee_id: '', target_files: '', start_date: '', end_date: '' }
const EMPTY_BULK = { section_id: '', target_files: '', start_date: '', end_date: '' }

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString()
}

export default function AdminCycleAssigner() {
  const [employees, setEmployees] = useState([])
  const [sections, setSections] = useState([])
  const [cycles, setCycles] = useState([])
  const [single, setSingle] = useState(EMPTY_SINGLE)
  const [bulk, setBulk] = useState(EMPTY_BULK)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [employeesRes, sectionsRes, cyclesRes] = await Promise.all([
        api.get('/employees'),
        api.get('/sections'),
        api.get('/cycles'),
      ])
      setEmployees(employeesRes.data)
      setSections(sectionsRes.data)
      setCycles(cyclesRes.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleSingleField = (event) => {
    setSingle((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleBulkField = (event) => {
    setBulk((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleAssignSingle = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.post('/cycles', {
        employee_id: Number(single.employee_id),
        target_files: Number(single.target_files),
        start_date: single.start_date,
        end_date: single.end_date,
      })
      setSingle(EMPTY_SINGLE)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleAssignBulk = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.post('/cycles/bulk', {
        section_id: Number(bulk.section_id),
        target_files: Number(bulk.target_files),
        start_date: bulk.start_date,
        end_date: bulk.end_date,
      })
      setBulk(EMPTY_BULK)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="manager">
      <h2>Cycles</h2>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="cycle-assign">
        <form className="create-form" onSubmit={handleAssignSingle}>
          <h3>Assign to one employee</h3>
          <label className="field">
            Employee
            <select
              name="employee_id"
              value={single.employee_id}
              onChange={handleSingleField}
              required
            >
              <option value="" disabled>
                Select an employee
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.employee_code})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Target files
            <input
              type="number"
              name="target_files"
              min="1"
              max="100"
              value={single.target_files}
              onChange={handleSingleField}
              required
            />
          </label>
          <label className="field">
            Start date
            <input
              type="date"
              name="start_date"
              value={single.start_date}
              onChange={handleSingleField}
              required
            />
          </label>
          <label className="field">
            End date
            <input
              type="date"
              name="end_date"
              value={single.end_date}
              onChange={handleSingleField}
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Assign cycle
          </button>
        </form>

        <form className="create-form" onSubmit={handleAssignBulk}>
          <h3>Assign to a whole section</h3>
          <label className="field">
            Section
            <select name="section_id" value={bulk.section_id} onChange={handleBulkField} required>
              <option value="" disabled>
                Select a section
              </option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Target files
            <input
              type="number"
              name="target_files"
              min="1"
              max="100"
              value={bulk.target_files}
              onChange={handleBulkField}
              required
            />
          </label>
          <label className="field">
            Start date
            <input
              type="date"
              name="start_date"
              value={bulk.start_date}
              onChange={handleBulkField}
              required
            />
          </label>
          <label className="field">
            End date
            <input
              type="date"
              name="end_date"
              value={bulk.end_date}
              onChange={handleBulkField}
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Assign to section
          </button>
        </form>
      </div>

      <h3 className="table-heading">All cycles</h3>
      {loading ? (
        <p className="empty">Loading…</p>
      ) : cycles.length === 0 ? (
        <p className="empty">No cycles yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Section</th>
              <th>Period</th>
              <th>Target</th>
              <th>Completed</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              const pct =
                cycle.target_files > 0
                  ? Math.round((cycle.completed_files / cycle.target_files) * 100)
                  : 0
              return (
                <tr key={cycle.id}>
                  <td>{cycle.employee?.name ?? '—'}</td>
                  <td>{cycle.employee?.section?.name ?? '—'}</td>
                  <td>
                    {formatDate(cycle.start_date)} – {formatDate(cycle.end_date)}
                  </td>
                  <td>{cycle.target_files}</td>
                  <td>{cycle.completed_files}</td>
                  <td className="cell-progress">
                    <ProgressBar value={pct} />
                  </td>
                  <td>
                    <span className={`status-badge ${cycle.status === 'active' ? 'registered' : 'unregistered'}`}>
                      {cycle.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
