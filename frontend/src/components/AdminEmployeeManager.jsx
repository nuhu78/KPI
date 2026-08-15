import { useCallback, useEffect, useState } from 'react'
import { api, getErrorMessage, getImageUrl } from '../api/client'
import PhotoUpload from './PhotoUpload'

const EMPTY_FORM = { employee_code: '', name: '', section_id: '' }

export default function AdminEmployeeManager() {
  const [employees, setEmployees] = useState([])
  const [sections, setSections] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [employeesRes, sectionsRes] = await Promise.all([
        api.get('/employees'),
        api.get('/sections'),
      ])
      setEmployees(employeesRes.data)
      setSections(sectionsRes.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleField = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setFile(null)
    setEditing(null)
  }

  const startEdit = (employee) => {
    setForm({
      employee_code: employee.employee_code,
      name: employee.name,
      section_id: String(employee.section_id),
    })
    setFile(null)
    setEditing(employee)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('employee_code', form.employee_code)
      fd.append('name', form.name)
      fd.append('section_id', form.section_id)
      if (file) {
        fd.append('image', file)
      }
      if (editing) {
        await api.patch(`/employees/${editing.id}`, fd)
      } else {
        await api.post('/employees', fd)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (employee) => {
    if (
      !window.confirm(
        `Delete ${employee.name} and all their cycle history?`,
      )
    )
      return
    setError('')
    try {
      await api.delete(`/employees/${employee.id}`)
      if (editing?.id === employee.id) {
        resetForm()
      }
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="manager">
      <h2>Employees</h2>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <form className="create-form" onSubmit={handleSubmit}>
        <h3>{editing ? 'Update employee' : 'Add employee'}</h3>
        <PhotoUpload file={file} onFileChange={setFile} />
        <label className="field">
          Employee code
          <input
            name="employee_code"
            value={form.employee_code}
            onChange={handleField}
            maxLength={50}
            required
          />
        </label>
        <label className="field">
          Full name
          <input
            name="name"
            value={form.name}
            onChange={handleField}
            maxLength={150}
            required
          />
        </label>
        <label className="field">
          Section
          <select name="section_id" value={form.section_id} onChange={handleField} required>
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
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? editing
                ? 'Updating…'
                : 'Adding…'
              : editing
                ? 'Update employee'
                : 'Add employee'}
          </button>
          {editing && (
            <button type="button" className="btn-ghost" onClick={resetForm}>
              Clear
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : employees.length === 0 ? (
        <p className="empty">No employees yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Code</th>
              <th>Name</th>
              <th>Section</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="cell-photo">
                  {employee.image_url ? (
                    <img
                      className="avatar"
                      src={getImageUrl(employee.image_url)}
                      alt={employee.name}
                    />
                  ) : (
                    <span className="avatar avatar-placeholder" />
                  )}
                </td>
                <td>{employee.employee_code}</td>
                <td>{employee.name}</td>
                <td>{employee.section?.name ?? '—'}</td>
                <td>
                  <span
                    className={`status-badge ${employee.is_registered ? 'registered' : 'unregistered'}`}
                  >
                    {employee.is_registered ? 'Registered' : 'Not registered'}
                  </span>
                </td>
                <td className="row-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => startEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(employee)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
