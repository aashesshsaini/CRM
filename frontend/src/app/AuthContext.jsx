import { createContext, useContext, useState, useEffect } from 'react'
import {
  isAuthenticated,
  clearAuthSession,
  sanitizeAuthSession,
} from '../services/authStorage.js'
import { fetchCurrentAgent } from '../services/authService.js'
import Loader from '../components/common/Loader.jsx'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanitizeAuthSession()

    const init = async () => {
      if (!isAuthenticated()) {
        setLoading(false)
        return
      }

      try {
        const freshAgent = await fetchCurrentAgent()
        setAgent(freshAgent)
      } catch {
        clearAuthSession()
        setAgent(null)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const login = (loggedInAgent) => {
    setAgent(loggedInAgent)
  }

  const logout = () => {
    clearAuthSession()
    setAgent(null)
  }

  if (loading) {
    return <Loader size="lg" message="Loading..." className="min-h-screen" />
  }

  return (
    <AuthContext.Provider value={{ agent, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
