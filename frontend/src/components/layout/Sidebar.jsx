import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Search,
  UserCog,
  TrendingUp,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/scraper', icon: Search, label: 'Scraper' },
  { to: '/agents', icon: UserCog, label: 'Agents' },
]

export default function Sidebar({ mobile = false, onClose }) {
  return (
    <aside className="h-full w-64 flex flex-col bg-navy-900 text-white select-none">
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Lead CRM</p>
            <p className="text-[10px] text-slate-400 leading-tight">Sales Dashboard</p>
          </div>
        </div>
        {mobile && (
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="section-label">Main Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-[11px] text-slate-500 text-center">
          Lead CRM v1.0 &middot; Internal Tool
        </p>
      </div>
    </aside>
  )
}
