import { createContext, useContext, useMemo, useState } from 'react'
import { ROLE_KEY, TOKEN_KEY } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY))

  const value = useMemo(() => {
    const login = (accessToken, userRole) => {
      localStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(ROLE_KEY, userRole)
      setToken(accessToken)
      setRole(userRole)
    }

    const logout = () => {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(ROLE_KEY)
      setToken(null)
      setRole(null)
    }

    return {
      token,
      role,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }
  }, [token, role])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
