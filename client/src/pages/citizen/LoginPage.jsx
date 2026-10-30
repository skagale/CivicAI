import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, EyeOff, AlertTriangle, Loader2, MapPin } from 'lucide-react'
import { useAuth } from '../../services/AuthContext'
import { heightCollapse } from '../../utils/animations'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        navigate('/admin')
      } else {
        setError(res.error || 'Invalid credentials')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = async () => {
    setEmail('admin@civicai.demo')
    setPassword('admin123')
    setError('')
    setLoading(true)
    try {
      const res = await login('admin@civicai.demo', 'admin123')
      if (res.success) navigate('/admin')
      else setError(res.error || 'Demo login failed')
    } catch {
      setError('Demo login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#14213D] rounded-xl flex items-center justify-center shadow-lg">
              <MapPin size={20} className="text-white" />
            </div>
            <span className="font-bold text-[#14213D] text-2xl tracking-tight">
              Civic<span className="text-[#2563EB]">AI</span>
            </span>
          </Link>
          <p className="mt-2 text-gray-500 text-sm">Administrator Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#14213D] rounded-lg flex items-center justify-center">
              <Shield size={15} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1E293B]">Admin Login</h1>
          </div>

          {/* Demo hint */}
          <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <strong>Demo credentials:</strong> admin@civicai.demo / admin123
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                variants={heightCollapse}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700"
              >
                <AlertTriangle size={15} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@civicai.demo"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-2.5 bg-[#14213D] text-white font-semibold rounded-lg hover:bg-[#1a2d52] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Logging in…' : 'Login'}
            </motion.button>

            <button
              type="button"
              onClick={fillDemo}
              disabled={loading}
              className="w-full py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Use Demo Credentials
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/" className="text-[#2563EB] hover:underline">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}
