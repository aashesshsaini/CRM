import { Navigate } from 'react-router-dom'
import ProtectedRoute, { GuestRoute, RootRedirect } from '../components/ProtectedRoute.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import DashboardPage from '../features/dashboard/DashboardPage.jsx'
import LeadsPage from '../features/leads/LeadsPage.jsx'
import ScraperPage from '../features/scraper/ScraperPage.jsx'
import AgentsPage from '../features/agents/AgentsPage.jsx'
import LoginPage from '../features/auth/LoginPage.jsx'
import UnauthorizedPage from '../features/auth/UnauthorizedPage.jsx'
import CallerLeadsPage from '../features/caller/CallerLeadsPage.jsx'

export const routes = [
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leads',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'scraper',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ScraperPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'agents',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <AgentsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/caller/leads',
    element: (
      <ProtectedRoute requiredRole="CALLER">
        <CallerLeadsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]
