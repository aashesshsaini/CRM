import { Menu, Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../app/AuthContext.jsx'

export default function Header({ onMenuClick, title }) {
  const navigate = useNavigate()
  const { agent, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const initial = agent?.name?.charAt(0)?.toUpperCase() || 'A'

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base md:text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        {agent?.name && (
          <span className="hidden sm:block text-sm text-gray-600 mr-1">{agent.name}</span>
        )}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {initial}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ml-1"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline text-sm">Logout</span>
        </button>
      </div>
    </header>
  )
}
