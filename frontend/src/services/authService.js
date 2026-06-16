import apiClient from './apiClient.js'
import {
  setAuthSession,
  clearAuthSession,
  getStoredAgent,
  getToken,
} from './authStorage.js'

export { getToken, isAuthenticated } from './authStorage.js'

export const loginAgent = async (email, password) => {
  const { data } = await apiClient.post('/auth/login', { email, password })

  if (!data.success) {
    throw new Error(data.message || 'Login failed')
  }

  const { agent, token } = data.data
  setAuthSession(token, agent)
  return { agent, token }
}

export const logoutAgent = () => {
  clearAuthSession()
}

export const getCurrentAgent = () => getStoredAgent()

export const fetchCurrentAgent = async () => {
  const { data } = await apiClient.get('/auth/me')
  const agent = data.data
  setAuthSession(getToken(), agent)
  return agent
}
