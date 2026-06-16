import { Navigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext.jsx'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { agent } = useAuth()

  if (!agent) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && agent.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export function GuestRoute({ children }) {
  const { agent } = useAuth()

  if (agent) {
    if (agent.role === 'CALLER') {
      return <Navigate to="/caller/leads" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function RootRedirect() {
  const { agent } = useAuth()

  if (!agent) {
    return <Navigate to="/login" replace />
  }

  if (agent.role === 'CALLER') {
    return <Navigate to="/caller/leads" replace />
  }

  return <Navigate to="/dashboard" replace />
}
