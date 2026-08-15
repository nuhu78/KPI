import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getErrorMessage, getImageUrl } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import EmployeeCycleCard from '../components/EmployeeCycleCard'
import '../styles/admin.css'

export default function EmployeeHome() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const [cycle, setCycle] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [undoing, setUndoing] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      const [meRes, cycleRes] = await Promise.all([
        api.get('/employees/me'),
        api.get('/employees/me/active-cycle'),
      ])
      setEmployee(meRes.data)
      setCycle(cycleRes.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleMarkComplete = async () => {
    if (!cycle) return
    setMarking(true)
    setError('')
    try {
      await api.patch(`/cycles/${cycle.id}/progress`)
      const { data } = await api.get('/employees/me/active-cycle')
      setCycle(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setMarking(false)
    }
  }

  const handleUndo = async () => {
    if (!cycle) return
    setUndoing(true)
    setError('')
    try {
      await api.patch(`/cycles/${cycle.id}/progress/undo`)
      const { data } = await api.get('/employees/me/active-cycle')
      setCycle(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setUndoing(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          KPI System
        </Link>
        <nav className="topbar-nav">
          <span className="role-badge">Employee</span>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="app-content employee-home">
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <>
            <section className="profile-card">
              <h2>My profile</h2>
              {employee && (
                <div className="profile">
                  {employee.image_url ? (
                    <img
                      className="avatar avatar-lg"
                      src={getImageUrl(employee.image_url)}
                      alt={employee.name}
                    />
                  ) : (
                    <span className="avatar avatar-lg avatar-placeholder" />
                  )}
                  <div>
                    <p className="profile-name">{employee.name}</p>
                    <p className="profile-meta">
                      {employee.employee_code} · {employee.section?.name ?? 'No section'}
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="profile-card">
              <EmployeeCycleCard
                cycle={cycle}
                marking={marking}
                undoing={undoing}
                onMarkComplete={handleMarkComplete}
                onUndo={handleUndo}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
