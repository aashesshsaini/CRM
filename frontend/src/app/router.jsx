import { Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import DashboardPage from '../features/dashboard/DashboardPage.jsx'
import LeadsPage from '../features/leads/LeadsPage.jsx'
import ScraperPage from '../features/scraper/ScraperPage.jsx'
import AgentsPage from '../features/agents/AgentsPage.jsx'

export const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'scraper', element: <ScraperPage /> },
      { path: 'agents', element: <AgentsPage /> },
    ],
  },
]
