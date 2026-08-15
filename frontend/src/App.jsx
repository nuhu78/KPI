import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminCycleAssigner from './components/AdminCycleAssigner'
import AdminEmployeeManager from './components/AdminEmployeeManager'
import AdminSectionManager from './components/AdminSectionManager'
import AdminLayout from './pages/AdminLayout'
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
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/sections" replace />} />
            <Route path="sections" element={<AdminSectionManager />} />
            <Route path="employees" element={<AdminEmployeeManager />} />
            <Route path="cycles" element={<AdminCycleAssigner />} />
          </Route>
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
