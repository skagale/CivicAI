import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Brain, Map, Users,
  BarChart2, Settings, LogOut, ChevronRight, ChevronLeft, Menu, X, MapPin,
} from 'lucide-react'
import { useAuth } from '../services/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/complaints', label: 'All Complaints', icon: MessageSquare },
  { to: '/admin/ai', label: 'AI Intelligence', icon: Brain, prefix: '/admin/ai' },
  { to: '/admin/map', label: 'Map & Hotspots', icon: Map },
  { to: '/admin/assignments', label: 'Assignments', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ collapsed, onItemClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-lg tracking-tight">
              Civic<span className="text-blue-400">AI</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User / logout */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        {!collapsed && user && (
          <div className="px-3 py-2 text-xs text-white/50 mb-1 truncate">
            {user.email}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-[#14213D] relative flex-shrink-0 overflow-hidden"
      >
        <SidebarContent collapsed={collapsed} />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-[#14213D] z-50 lg:hidden"
          >
            <SidebarContent collapsed={false} onItemClick={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="font-bold text-[#14213D]">
            Civic<span className="text-[#2563EB]">AI</span> Admin
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
