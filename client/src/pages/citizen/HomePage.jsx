import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Brain, MapPin, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import api from '../../services/api'
import { fadeUp, scaleUp, staggerContainer, staggerChild, viewport } from '../../utils/animations'
import { useCountUp } from '../../hooks/useCountUp'

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Your Complaint', desc: 'Fill out a quick form with details, photos, and pin your location on the map.', icon: MapPin },
  { step: '02', title: 'AI Analysis', desc: 'Our AI instantly categorizes, summarizes, and prioritizes your complaint.', icon: Brain },
  { step: '03', title: 'Department Assignment', desc: 'Automatically routed to the right department with priority scoring.', icon: Search },
  { step: '04', title: 'Track Resolution', desc: 'Monitor real-time progress using your unique complaint tracking ID.', icon: CheckCircle },
]

const AI_FEATURES = [
  { title: 'Smart Categorization', desc: 'AI automatically classifies complaints into relevant categories.', icon: Brain },
  { title: 'Priority Scoring', desc: 'Explainable priority scores based on safety risk, urgency, and impact.', icon: AlertTriangle },
  { title: 'Duplicate Detection', desc: 'Identifies similar complaints to avoid redundant work.', icon: Search },
  { title: 'Action Briefs', desc: 'AI-generated summaries to help officials take faster action.', icon: CheckCircle },
]

const CATEGORIES = [
  { name: 'Road Damage', icon: '🛣️', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Waterlogging', icon: '💧', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Waste Management', icon: '♻️', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Streetlight Issues', icon: '💡', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { name: 'Drainage Problems', icon: '🚰', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Water Supply', icon: '🚿', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Public Safety', icon: '🚨', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Other', icon: '📋', color: 'bg-gray-50 text-gray-700 border-gray-200' },
]

function StatCard({ label, value, icon: Icon, color, index, loaded }) {
  const count = useCountUp(value, 1200, loaded)
  return (
    <motion.div
      variants={staggerChild}
      className="text-center"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${color}`}>
        <Icon size={22} />
      </div>
      <div className="text-3xl font-bold text-[#1E293B]">{count}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0, critical: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/analytics')
      .then((res) => {
        const s = res.data?.summary || {}
        setStats({
          total: s.total || 40,
          resolved: s.resolved || 12,
          inProgress: s.inProgress || 8,
          critical: s.critical || 5,
        })
        setLoaded(true)
      })
      .catch(() => {
        setStats({ total: 40, resolved: 12, inProgress: 8, critical: 5 })
        setLoaded(true)
      })
  }, [])

  const statItems = [
    { label: 'Total Complaints', value: stats.total, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Critical Issues', value: stats.critical, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#14213D] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, #2563EB 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              AI-Powered Civic Platform – Hackathon Demo
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your City.{' '}
              <span className="text-blue-400">Your Voice.</span>
              <br />
              Our Action.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Report civic problems, track their progress and help make your community better with AI-powered civic intelligence.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Report a Problem <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Search size={18} /> Track My Complaint
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {statItems.map((item, i) => (
              <StatCard key={item.label} {...item} index={i} loaded={loaded} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1E293B] mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From complaint to resolution in four simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={viewport}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-shadow"
              >
                <div className="text-4xl font-bold text-blue-100 mb-4">{item.step}</div>
                <div className="w-10 h-10 bg-[#14213D] rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-[#1E293B] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1E293B] mb-3">Complaint Categories</h2>
            <p className="text-gray-500">We handle all types of civic issues</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={scaleUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={viewport}
                whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center gap-3 p-5 border rounded-xl cursor-pointer transition-all ${cat.color}`}
                onClick={() => (window.location.href = '/report')}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-center">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 bg-[#14213D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">How AI Helps Communities</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our intelligent engine transforms raw complaints into prioritized, actionable civic intelligence
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={viewport}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feat.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
              Make Your City Better
            </h2>
            <p className="text-gray-500 mb-8">
              Join thousands of citizens making a difference by reporting civic issues.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Report an Issue <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-gray-200 text-[#1E293B] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Search size={18} /> Track Existing
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
