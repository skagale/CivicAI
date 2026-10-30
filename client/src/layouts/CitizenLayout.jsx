import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Menu, X, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import { slideDown, fadeIn, viewport } from '../utils/animations'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report Issue' },
  { to: '/track', label: 'Track Complaint' },
  { to: '/about', label: 'About' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#14213D] rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#14213D] text-lg tracking-tight">
            Civic<span className="text-[#2563EB]">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#14213D] text-white'
                    : 'text-[#1E293B] hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Shield size={14} />
                  Admin
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d52] transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'bg-[#14213D] text-white'
                        : 'text-[#1E293B] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 text-sm font-medium text-[#2563EB] hover:bg-blue-50 rounded-lg"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2.5 bg-[#14213D] text-white text-sm font-medium rounded-lg text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="bg-[#14213D] text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                Civic<span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              AI-powered civic complaint management platform. Transforming complaints into actions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="font-semibold mb-3 text-gray-300">Platform</div>
              <div className="space-y-2 text-gray-400">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/report', label: 'Report Issue' },
                  { to: '/track', label: 'Track Complaint' },
                ].map((link) => (
                  <motion.div
                    key={link.to}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link to={link.to} className="block hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3 text-gray-300">Info</div>
              <div className="space-y-2 text-gray-400">
                {[
                  { to: '/about', label: 'About' },
                  { to: '/login', label: 'Admin Login' },
                ].map((link) => (
                  <motion.div
                    key={link.to}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link to={link.to} className="block hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2024 CivicAI – Hackathon Demo. Not affiliated with any government body. Data is synthetic.
        </div>
      </div>
    </motion.footer>
  )
}

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
