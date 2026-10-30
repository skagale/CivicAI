import { motion } from 'framer-motion'
import { AlertTriangle, Database, Brain, MapPin, Shield } from 'lucide-react'
import { fadeUp, staggerContainer, staggerChild, viewport } from '../../utils/animations'

const INTEGRATIONS = [
  {
    icon: Database,
    title: 'Supabase Database',
    desc: 'PostgreSQL database for persistent complaint storage.',
    status: 'demo',
    envKey: 'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Brain,
    title: 'Google Gemini AI',
    desc: 'AI-powered complaint analysis, categorization, and summaries.',
    status: 'demo',
    envKey: 'GEMINI_API_KEY',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: MapPin,
    title: 'OpenStreetMap',
    desc: 'Free tile-based map provider. No API key required.',
    status: 'active',
    envKey: 'None required',
    color: 'bg-green-50 text-green-600',
  },
]

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold text-[#1E293B]">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform configuration and information</p>
      </motion.div>

      {/* Demo mode banner */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-amber-600" />
          <h2 className="font-semibold text-amber-800">Demo Mode Active</h2>
        </div>
        <p className="text-sm text-amber-700">
          CivicAI is running in demo mode. All data is synthetic. Connect Supabase and Gemini API credentials in the{' '}
          <code className="bg-amber-100 px-1 rounded">.env</code> files to enable live functionality.
        </p>
      </motion.div>

      {/* Integrations */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        {INTEGRATIONS.map((item, i) => (
          <motion.div key={item.title} variants={staggerChild} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E293B]">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  <code className="text-xs text-gray-400 mt-1 block">{item.envKey}</code>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.status === 'active' ? '✓ Active' : '⚠ Demo'}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Credentials */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.35 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#14213D] rounded-lg flex items-center justify-center">
            <Shield size={15} className="text-white" />
          </div>
          <h2 className="font-semibold text-[#1E293B]">Demo Credentials</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Admin Email</span>
            <code className="text-[#1E293B] font-medium">admin@civicai.demo</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Admin Password</span>
            <code className="text-[#1E293B] font-medium">admin123</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Backend URL</span>
            <code className="text-[#1E293B] font-medium">http://localhost:5000</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Frontend URL</span>
            <code className="text-[#1E293B] font-medium">http://localhost:5173</code>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
