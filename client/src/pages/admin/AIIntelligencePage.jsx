import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, AlertTriangle, Shield, Copy, CheckCircle, RefreshCw, Loader2 } from 'lucide-react'
import api from '../../services/api'
import { staggerContainer, staggerChild, fadeUp } from '../../utils/animations'
import { useCountUp } from '../../hooks/useCountUp'

const FILTERS = [
  { key: 'all', label: 'All AI Analyzed' },
  { key: 'critical', label: 'Critical' },
  { key: 'high', label: 'High Priority' },
  { key: 'safety', label: 'Safety Risks' },
  { key: 'duplicates', label: 'Duplicates' },
]

function priorityClass(level) {
  if (level === 'Critical') return 'bg-red-100 text-red-700 border-red-200'
  if (level === 'High') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (level === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  return 'bg-green-100 text-green-700 border-green-200'
}

function StatCard({ label, value, icon: Icon, color, loading }) {
  const count = useCountUp(value, 1100, !loading)
  return (
    <motion.div variants={staggerChild} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-bold text-[#1E293B]">
        {loading ? <span className="text-gray-300 animate-pulse">—</span> : count}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </motion.div>
  )
}

export default function AIIntelligencePage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [brief, setBrief] = useState('')
  const [generatingBrief, setGeneratingBrief] = useState(false)
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/complaints?limit=50&sort=priority_score&order=desc')
      setComplaints(res.data.complaints || res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const generateBrief = async () => {
    setGeneratingBrief(true)
    try {
      const res = await api.post('/ai/action-brief', { limit: 10 })
      setBrief(res.data.brief || res.data.action_brief || 'No brief generated.')
    } catch {
      setBrief('Failed to generate brief. Please try again.')
    } finally {
      setGeneratingBrief(false)
    }
  }

  const copyBrief = () => {
    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const duplicates = complaints.filter((c) => c.duplicate_count > 0 || (c.duplicate_matches && c.duplicate_matches.length > 0))

  const filtered = complaints.filter((c) => {
    if (filter === 'critical') return c.priority_level === 'Critical'
    if (filter === 'high') return c.priority_level === 'High'
    if (filter === 'safety') return c.safety_risk
    if (filter === 'duplicates') return c.duplicate_count > 0
    return true
  })

  const stats = [
    { label: 'AI Analyzed', value: complaints.filter((c) => c.ai_summary).length, icon: Brain, color: 'bg-blue-50 text-blue-600' },
    { label: 'Critical Issues', value: complaints.filter((c) => c.priority_level === 'Critical').length, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
    { label: 'Safety Risks', value: complaints.filter((c) => c.safety_risk).length, icon: Shield, color: 'bg-orange-50 text-orange-600' },
    { label: 'Possible Duplicates', value: duplicates.length, icon: Copy, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">AI Intelligence</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-powered complaint analysis and insights</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} loading={loading} />)}
      </motion.div>

      {/* Action Brief */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain size={15} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1E293B]">AI Action Brief</h2>
              <p className="text-xs text-gray-500">Generate an actionable summary for field officers</p>
            </div>
          </div>
          <div className="flex gap-2">
            {brief && (
              <button
                onClick={copyBrief}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            <motion.button
              onClick={generateBrief}
              disabled={generatingBrief}
              whileHover={!generatingBrief ? { scale: 1.03 } : {}}
              whileTap={!generatingBrief ? { scale: 0.97 } : {}}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {generatingBrief ? <Loader2 size={12} className="animate-spin" /> : <Shield size={12} />}
              Generate Brief
            </motion.button>
          </div>
        </div>

        {generatingBrief ? (
          <div className="bg-white/60 rounded-lg p-4 text-sm text-gray-400 animate-pulse">
            Generating AI brief…
          </div>
        ) : brief ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg p-4 text-sm text-gray-700 leading-relaxed border border-blue-100"
            >
              {brief}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-white/60 rounded-lg p-4 text-sm text-gray-400">
            Click "Generate Brief" to get an AI-powered action summary based on current complaints.
          </div>
        )}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filter === f.key ? 'bg-[#14213D] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Brain size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No complaints match this filter.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          key={filter}
        >
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              variants={staggerChild}
              whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.07)' }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="font-mono text-xs text-blue-600 font-medium">{c.complaint_number}</div>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${priorityClass(c.priority_level)}`}>
                  {c.priority_level || 'Medium'}
                </span>
              </div>
              <h3 className="font-semibold text-[#1E293B] text-sm mb-2 leading-snug">{c.title}</h3>
              {c.ai_summary && (
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{c.ai_summary}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{c.category}</span>
                {c.priority_score != null && (
                  <div className="flex items-center gap-1.5">
                    <span>Score: <strong className="text-[#1E293B]">{c.priority_score}/10</strong></span>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.priority_score / 10) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="bg-blue-500 h-1.5 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              {c.safety_risk && (
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-medium">
                  <Shield size={11} /> Safety Risk
                </div>
              )}
              {c.duplicate_count > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 font-medium">
                  <Copy size={11} /> {c.duplicate_count} similar report(s)
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
