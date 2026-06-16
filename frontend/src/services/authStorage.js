const TOKEN_KEY = 'token'
const AGENT_KEY = 'agent'

const isValidToken = (token) =>
  !!token && token !== 'undefined' && token !== 'null'

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  return isValidToken(token) ? token : null
}

export const getStoredAgent = () => {
  try {
    const agent = localStorage.getItem(AGENT_KEY)
    if (!agent || agent === 'undefined' || agent === 'null') return null
    return JSON.parse(agent)
  } catch {
    return null
  }
}

export const setAuthSession = (token, agent) => {
  if (!isValidToken(token) || !agent) {
    clearAuthSession()
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(AGENT_KEY, JSON.stringify(agent))
}

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AGENT_KEY)
}

export const isAuthenticated = () => !!getToken()

export const sanitizeAuthSession = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const agent = localStorage.getItem(AGENT_KEY)

  if (!isValidToken(token)) {
    clearAuthSession()
    return
  }

  if (agent === 'undefined' || agent === 'null') {
    localStorage.removeItem(AGENT_KEY)
    return
  }

  try {
    if (agent) JSON.parse(agent)
  } catch {
    clearAuthSession()
  }
}
