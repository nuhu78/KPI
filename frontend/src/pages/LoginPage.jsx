import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api, getErrorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import '../styles/auth.css'

export default function LoginPage() {
  const location = useLocation()
  const [tab, setTab] = useState(location.state?.tab ?? 'employee')
  const [id, setId] = useState(location.state?.code ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const isAdmin = tab === 'admin'
  const idLabel = isAdmin ? 'Admin ID' : 'Employee code'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const path = isAdmin ? '/auth/admin/login' : '/auth/employee/login'
      const body = isAdmin
        ? { admin_id: id, password }
        : { employee_code: id, password }
      const { data } = await api.post(path, body)
      login(data.access_token, isAdmin ? 'admin' : 'employee')
      const from = location.state?.from?.pathname
      navigate(from || (isAdmin ? '/admin' : '/me'), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Sign in</h1>
        <div className="auth-tabs">
          <button
            type="button"
            className={!isAdmin ? 'active' : ''}
            onClick={() => setTab('employee')}
          >
            Employee
          </button>
          <button
            type="button"
            className={isAdmin ? 'active' : ''}
            onClick={() => setTab('admin')}
          >
            Admin
          </button>
        </div>
        <label className="auth-label">
          {idLabel}
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            autoFocus
            autoComplete="username"
          />
        </label>
        <label className="auth-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="auth-alt">
          New employee? <Link to="/register">Register here</Link>
        </p>
        <Link to="/" className="auth-back">
          &larr; Back to home
        </Link>
      </form>
    </main>
  )
}
