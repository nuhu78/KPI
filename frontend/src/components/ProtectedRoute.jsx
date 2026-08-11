import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/me'} replace />
  }

  return children
}
