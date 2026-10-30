import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle, Brain, Clock, Building2, AlertTriangle, Loader2, MapPin } from 'lucide-react'
import api from '../../services/api'
import { heightCollapse, viewport } from '../../utils/animations'

const TIMELINE_STEPS = [
  { key: 'Submitted', label: 'Submitted', icon: CheckCircle },
  { key: 'AI Analyzed', label: 'AI Analyzed', icon: Brain },
  { key: 'Under Review', label: 'Under Review', icon: Clock },
  { key: 'Assigned', label: 'Assigned', icon: Building2 },
  { key: 'In Progress', label: 'In Progress', icon: AlertTriangle },
  { key: 'Resolved', label: 'Resolved', icon: CheckCircle },
]

function getStepIndex(status) {
  return TIMELINE_STEPS.findIndex((s) => s.key === status)
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function priorityClass(level) {
  if (level === 'Critical') return 'bg-red-100 text-red-700'
  if (level === 'High') return 'bg-orange-100 text-orange-700'
  if (level === 'Medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

export default function TrackPage() {
  const [params] = useSearchParams()
  const [input, setInput] = useState(params.get('id') || '')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.get('id')) track(params.get('id'))
  }, []) // eslint-disable-line

  const track = async (id) => {
    const q = (id || input || '').trim().toUpperCase()
    if (!q) { setError('Please enter a tracking ID'); return }
    setLoading(true)
    setError('')
    setComplaint(null)
    try {
      const res = await api.get(`/complaints/track/${q}`)
      setComplaint(res.data.complaint || res.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Complaint not found. Please check your tracking ID.')
      } else {
        setError('Failed to fetch complaint. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const currentStep = complaint ? getStepIndex(complaint.status) : -1

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Track Your Complaint</h1>
            <p className="text-gray-500">Enter your complaint ID to see the current status</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && track()}
                placeholder="E.g., CIV-2024-0001"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
              />
              <motion.button
                onClick={() => track()}
                disabled={loading}
                whileHover={!loading ? { scale: 1.04 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className="px-5 py-2.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Track
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  variants={heightCollapse}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-3 text-sm text-red-600 flex items-center gap-1.5"
                >
                  <AlertTriangle size={14} /> {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Result */}
          <AnimatePresence>
            {complaint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {/* Summary card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-xs font-mono text-blue-600 font-medium mb-1">
                        {complaint.complaint_number}
                      </div>
                      <h2 className="text-xl font-bold text-[#1E293B]">{complaint.title}</h2>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${priorityClass(complaint.priority_level)}`}>
                      {complaint.priority_level || 'Medium'} Priority
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Brain size={14} className="text-gray-400" />
                      {complaint.category}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {formatDate(complaint.created_at)}
                    </div>
                    {complaint.address && (
                      <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <MapPin size={14} className="text-gray-400" />
                        {complaint.address}
                      </div>
                    )}
                    {complaint.assigned_department && (
                      <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <Building2 size={14} className="text-gray-400" />
                        Assigned to: <strong>{complaint.assigned_department}</strong>
                      </div>
                    )}
                  </div>
                  {complaint.ai_summary && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1">
                        <Brain size={12} /> AI Summary
                      </div>
                      <p className="text-sm text-blue-800">{complaint.ai_summary}</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-[#1E293B] mb-5">Progress Timeline</h3>
                  <div className="space-y-0">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const done = idx <= currentStep
                      const active = idx === currentStep
                      const Icon = step.icon
                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-start gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={false}
                              animate={{
                                backgroundColor: done
                                  ? active ? '#2563EB' : '#16a34a'
                                  : '#f3f4f6',
                                scale: active ? 1.15 : 1,
                              }}
                              transition={{ duration: 0.3, delay: idx * 0.08 }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon size={15} className={done ? 'text-white' : 'text-gray-400'} />
                            </motion.div>
                            {idx < TIMELINE_STEPS.length - 1 && (
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.4, delay: idx * 0.08 + 0.15 }}
                                className={`w-0.5 h-8 mt-1 origin-top ${done && idx < currentStep ? 'bg-green-400' : 'bg-gray-200'}`}
                              />
                            )}
                          </div>
                          <div className={`pb-6 ${idx === TIMELINE_STEPS.length - 1 ? 'pb-0' : ''}`}>
                            <div
                              className={`text-sm font-semibold ${
                                done
                                  ? active ? 'text-[#2563EB]' : 'text-green-700'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </div>
                            {active && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                Current status · Updated {formatDate(complaint.updated_at || complaint.created_at)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {complaint.status === 'Resolved' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                        <CheckCircle size={16} /> Complaint Resolved
                      </div>
                      {complaint.resolution_note && (
                        <p className="text-sm text-green-700">{complaint.resolution_note}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
