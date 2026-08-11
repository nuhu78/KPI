import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import RankingTable from '../components/RankingTable'
import SectionAccordion from '../components/SectionAccordion'
import '../styles/dashboard.css'

export default function HomePage() {
  const { isAuthenticated, role } = useAuth()
  const [employees, setEmployees] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const [employeesRes, sectionsRes] = await Promise.all([
        api.get('/dashboard/employees'),
        api.get('/dashboard/sections'),
      ])
      setEmployees(employeesRes.data)
      setSections(sectionsRes.data)
    } catch {
      setError('Failed to load dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <Link to="/" className="brand">
          KPI System
        </Link>
        <nav className="topbar-nav">
          {isAuthenticated ? (
            <Link to={role === 'admin' ? '/admin' : '/me'}>My dashboard</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="dashboard-body">
        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        <section className="panel">
          <div className="panel-title">
            <h2>Employee Ranking</h2>
            <button type="button" className="refresh-btn" onClick={handleRefresh} disabled={loading || refreshing}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          {loading ? <p className="empty">Loading…</p> : <RankingTable rows={employees} />}
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>Section Ranking</h2>
          </div>
          {loading ? <p className="empty">Loading…</p> : <SectionAccordion sections={sections} />}
        </section>
      </main>
    </div>
  )
}
