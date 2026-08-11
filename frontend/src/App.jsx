import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminHome from './pages/AdminHome'
import EmployeeHome from './pages/EmployeeHome'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me"
            element={
              <ProtectedRoute role="employee">
                <EmployeeHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
