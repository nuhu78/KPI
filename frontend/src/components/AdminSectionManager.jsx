import { useCallback, useEffect, useState } from 'react'
import { api, getErrorMessage } from '../api/client'

export default function AdminSectionManager() {
  const [sections, setSections] = useState([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/sections')
      setSections(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.post('/sections', { name })
      setName('')
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.patch(`/sections/${editId}`, { name: editName })
      setEditId(null)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section? Existing employees in it will be affected.')) return
    setError('')
    try {
      await api.delete(`/sections/${id}`)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="manager">
      <h2>Sections</h2>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New section name"
          maxLength={100}
          required
        />
        <button type="submit" className="btn-primary">
          Add section
        </button>
      </form>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : sections.length === 0 ? (
        <p className="empty">No sections yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                {editId === section.id ? (
                  <>
                    <td>
                      <form className="inline-form" onSubmit={handleUpdate}>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={100}
                          required
                        />
                        <button type="submit" className="btn-primary">
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    </td>
                    <td>{new Date(section.created_at).toLocaleDateString()}</td>
                    <td></td>
                  </>
                ) : (
                  <>
                    <td>{section.name}</td>
                    <td>{new Date(section.created_at).toLocaleDateString()}</td>
                    <td className="row-actions">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => {
                          setEditId(section.id)
                          setEditName(section.name)
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(section.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
