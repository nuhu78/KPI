import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import '../styles/admin.css'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          KPI System
        </Link>
        <nav className="topbar-nav">
          <span className="role-badge">Admin</span>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <NavLink
            to="/admin/sections"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Sections
          </NavLink>
          <NavLink
            to="/admin/employees"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Employees
          </NavLink>
          <NavLink
            to="/admin/cycles"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Cycles
          </NavLink>
        </aside>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
