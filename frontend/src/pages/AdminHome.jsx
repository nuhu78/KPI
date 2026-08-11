import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import '../styles/auth.css'

export default function AdminHome() {
  const { logout } = useAuth()

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Admin Panel</h1>
        <p className="auth-verified">
          Section & employee management arrive in the next phases.
        </p>
        <Link to="/" className="auth-submit">
          Back home
        </Link>
        <button type="button" className="auth-link" onClick={logout}>
          Log out
        </button>
      </div>
    </main>
  )
}
