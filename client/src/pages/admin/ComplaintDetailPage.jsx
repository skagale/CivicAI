import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Brain, MapPin, Building2, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import api from '../../services/api'
import { heightCollapse, fadeUp } from '../../utils/animations'

const DEPARTMENTS = ['Public Works', 'Sanitation', 'Water Supply', 'Electricity', 'Drainage', 'Municipal Administration']
const STATUSES = ['Submitted', 'AI Analyzed', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected']

function priorityClass(level) {
  if (level === 'Critical') return 'bg-red-100 text-red-700'
  if (level === 'High') return 'bg-orange-100 text-orange-700'
  if (level === 'Medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

function statusClass(status) {
  if (status === 'Resolved') return 'bg-green-100 text-green-700'
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700'
  if (status === 'Assigned') return 'bg-purple-100 text-purple-700'
  if (status === 'Rejected') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [note, setNote] = useState('')
  const [dept, setDept] = useState('')
  const [feedback, setFeedback] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/complaints/${id}`)
      const c = res.data.complaint || res.data
      setComplaint(c)
      setUpdates(res.data.updates || [])
      setNewStatus(c.status)
      setDept(c.assigned_department || '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id]) // eslint-disable-line

  const updateStatus = async () => {
    if (!newStatus) return
    setSaving(true)
    setFeedback(null)
    try {
      await api.put(`/complaints/${id}/status`, { status: newStatus, note, updated_by: 'Admin' })
      setFeedback({ type: 'success', text: 'Status updated successfully' })
      setNote('')
      await load()
    } catch {
      setFeedback({ type: 'error', text: 'Update failed. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const assignDept = async () => {
    if (!dept) return
    setSaving(true)
    try {
      await api.put(`/complaints/${id}/assign`, { department: dept, assigned_by: 'Admin' })
      setFeedback({ type: 'success', text: `Assigned to ${dept}` })
      await load()
    } catch {
      setFeedback({ type: 'error', text: 'Assignment failed.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    )
  }

  if (!complaint) return null

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Back + title */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1E293B] mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Complaints
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="font-mono text-blue-600 text-xs font-medium">{complaint.complaint_number}</span>
            <h1 className="text-2xl font-bold text-[#1E293B] mt-0.5">{complaint.title}</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityClass(complaint.priority_level)}`}>
              {complaint.priority_level || 'Medium'} Priority
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            variants={heightCollapse}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
              feedback.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: details + AI */}
        <div className="lg:col-span-2 space-y-5">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="font-semibold text-[#1E293B] mb-4">Complaint Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600"><Brain size={14} className="text-gray-400" /> {complaint.category}</div>
              <div className="flex items-center gap-2 text-gray-600"><Clock size={14} className="text-gray-400" /> {formatDate(complaint.created_at)}</div>
              {complaint.address && (
                <div className="flex items-center gap-2 text-gray-600 col-span-2"><MapPin size={14} className="text-gray-400" /> {complaint.address}</div>
              )}
              {complaint.assigned_department && (
                <div className="flex items-center gap-2 text-gray-600 col-span-2"><Building2 size={14} className="text-gray-400" /> {complaint.assigned_department}</div>
              )}
            </div>
            <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">{complaint.description}</div>
            {complaint.image_url && (
              <div className="mt-4">
                <img src={complaint.image_url} alt="Complaint" className="w-full max-h-64 object-cover rounded-xl border border-gray-200" />
              </div>
            )}
          </motion.div>

          {/* AI Analysis */}
          {(complaint.ai_summary || complaint.priority_reason) && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain size={15} className="text-white" />
                </div>
                <h2 className="font-semibold text-[#1E293B]">AI Analysis</h2>
              </div>
              {complaint.ai_summary && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Summary</div>
                  <p className="text-sm text-gray-700">{complaint.ai_summary}</p>
                </div>
              )}
              {complaint.priority_reason && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Priority Explanation</div>
                  <p className="text-sm text-gray-700">{complaint.priority_reason}</p>
                </div>
              )}
              {complaint.priority_score != null && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Priority Score</span>
                    <span className="font-bold">{complaint.priority_score}/10</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(complaint.priority_score / 10) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right: actions */}
        <div className="space-y-5">
          {/* Update status */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="font-semibold text-[#1E293B] mb-4">Update Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 mb-3"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)…"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none mb-3"
            />
            <motion.button
              onClick={updateStatus}
              disabled={saving}
              whileHover={!saving ? { scale: 1.02 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
              className="w-full py-2 bg-[#14213D] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d52] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? 'Saving…' : 'Update Status'}
            </motion.button>
          </motion.div>

          {/* Assign department */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="font-semibold text-[#1E293B] mb-4">Assign Department</h2>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 mb-3"
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <motion.button
              onClick={assignDept}
              disabled={saving || !dept}
              whileHover={!saving && dept ? { scale: 1.02 } : {}}
              whileTap={!saving && dept ? { scale: 0.98 } : {}}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? 'Assigning…' : 'Assign'}
            </motion.button>
          </motion.div>

          {/* Update history */}
          {updates.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <h2 className="font-semibold text-[#1E293B] mb-4">Update History</h2>
              <div className="space-y-3">
                {updates.map((u, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-xs border-l-2 border-blue-200 pl-3"
                  >
                    <div className="font-semibold text-[#1E293B]">{u.status}</div>
                    {u.note && <div className="text-gray-500 mt-0.5">{u.note}</div>}
                    <div className="text-gray-400 mt-0.5">{formatDate(u.created_at)}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
