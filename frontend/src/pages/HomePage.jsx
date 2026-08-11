import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function HomePage() {
  const { isAuthenticated, role } = useAuth()

  return (
    <main className="home">
      <div>
        <h1>KPI System</h1>
        <nav className="home-nav">
          {isAuthenticated ? (
            <Link to={role === 'admin' ? '/admin' : '/me'}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </main>
  )
}
