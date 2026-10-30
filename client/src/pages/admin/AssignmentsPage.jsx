import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, RefreshCw, CheckCircle, Loader2 } from 'lucide-react'
import api from '../../services/api'
import { staggerContainer, staggerChild, fadeUp, tableRow } from '../../utils/animations'

const DEPARTMENTS = ['Public Works', 'Sanitation', 'Water Supply', 'Electricity', 'Drainage', 'Municipal Administration']

function priorityClass(level) {
  if (level === 'Critical') return 'bg-red-100 text-red-700'
  if (level === 'High') return 'bg-orange-100 text-orange-700'
  if (level === 'Medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

export default function AssignmentsPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('unassigned')
  const [assigning, setAssigning] = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/complaints?limit=100&sort=priority_score&order=desc')
      setComplaints(res.data.complaints || res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const assign = async (id, dept) => {
    setAssigning((a) => ({ ...a, [id]: true }))
    try {
      await api.put(`/complaints/${id}/assign`, { department: dept, assigned_by: 'Admin' })
      await load()
    } catch (err) {
      console.error(err)
    } finally {
      setAssigning((a) => ({ ...a, [id]: false }))
    }
  }

  const filtered = complaints.filter((c) => {
    if (filter === 'unassigned') return !c.assigned_department
    if (filter === 'assigned') return !!c.assigned_department
    if (filter === 'critical') return c.priority_level === 'Critical'
    return true
  })

  const deptCounts = DEPARTMENTS.reduce((acc, d) => {
    acc[d] = complaints.filter((c) => c.assigned_department === d).length
    return acc
  }, {})

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Assignments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Assign complaints to the right departments</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      {/* Department stat cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEPARTMENTS.map((dept) => (
          <motion.div key={dept} variants={staggerChild} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 text-center">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Building2 size={16} className="text-blue-600" />
            </div>
            <div className="text-lg font-bold text-[#1E293B]">{deptCounts[dept]}</div>
            <div className="text-xs text-gray-500 leading-tight mt-0.5">{dept}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: 'unassigned', label: `Unassigned (${complaints.filter((c) => !c.assigned_department).length})` },
          { key: 'assigned', label: 'Assigned' },
          { key: 'critical', label: 'Critical' },
          { key: 'all', label: 'All' },
        ].map((f) => (
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

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
          <p className="text-gray-500">All caught up! No complaints in this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['ID', 'Title', 'Category', 'Priority', 'Current Dept', 'Assign To'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  variants={tableRow}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-blue-600">{c.complaint_number}</td>
                  <td className="px-5 py-3 max-w-[180px] truncate font-medium text-[#1E293B]">{c.title}</td>
                  <td className="px-5 py-3 text-gray-600">{c.category}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityClass(c.priority_level)}`}>
                      {c.priority_level || 'Medium'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{c.assigned_department || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={c.assigned_department || ''}
                        onChange={(e) => e.target.value && assign(c.id, e.target.value)}
                        disabled={assigning[c.id]}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none disabled:opacity-50"
                      >
                        <option value="">Select…</option>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {assigning[c.id] && <Loader2 size={14} className="animate-spin text-blue-600" />}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
