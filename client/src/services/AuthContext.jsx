import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('civic_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password)
      const { data: userData, token } = res.data
      setUser(userData)
      localStorage.setItem('civic_user', JSON.stringify(userData))
      localStorage.setItem('civic_token', token)
      return { success: true, user: userData }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid credentials',
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('civic_user')
    localStorage.removeItem('civic_token')
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
