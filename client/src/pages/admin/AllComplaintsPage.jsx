import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, RefreshCw, ChevronDown, ChevronUp, ArrowRight, FileX } from 'lucide-react'
import api from '../../services/api'
import { tableRow, fadeUp } from '../../utils/animations'

const CATEGORIES = ['All', 'Road Damage', 'Waterlogging', 'Waste Management', 'Streetlight Issues', 'Drainage Problems', 'Water Supply', 'Public Safety', 'Other']
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
const STATUSES = ['All', 'Submitted', 'AI Analyzed', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected']
const PAGE_SIZE = 15

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
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function SortIcon({ col, sortCol, sortOrder }) {
  if (sortCol !== col) return <ChevronDown size={13} className="text-gray-300" />
  return sortOrder === 'asc'
    ? <ChevronUp size={13} className="text-blue-600" />
    : <ChevronDown size={13} className="text-blue-600" />
}

export default function AllComplaintsPage() {
  const [params, setParams] = useSearchParams()
  const [complaints, setComplaints] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const search = params.get('search') || ''
  const category = params.get('category') || 'All'
  const priority = params.get('priority') || 'All'
  const status = params.get('status') || 'All'
  const page = parseInt(params.get('page') || '1')
  const sortCol = params.get('sort') || 'created_at'
  const sortOrder = params.get('order') || 'desc'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, sort: sortCol, order: sortOrder })
      if (search) q.set('search', search)
      if (category !== 'All') q.set('category', category)
      if (priority !== 'All') q.set('priority', priority)
      if (status !== 'All') q.set('status', status)
      const res = await api.get(`/complaints?${q}`)
      setComplaints(res.data.complaints || res.data || [])
      setTotal(res.data.total || (res.data.complaints || res.data || []).length)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, category, priority, status, page, sortCol, sortOrder])

  useEffect(() => { load() }, [load])

  const setFilter = (key, val) => {
    const p = new URLSearchParams(params)
    if (!val || val === 'All') p.delete(key)
    else p.set(key, val)
    p.set('page', '1')
    setParams(p)
  }

  const toggleSort = (col) => {
    const p = new URLSearchParams(params)
    if (sortCol === col) {
      p.set('order', sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      p.set('sort', col)
      p.set('order', 'desc')
    }
    setParams(p)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const setPage = (n) => {
    const p = new URLSearchParams(params)
    p.set('page', n)
    setParams(p)
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">All Complaints</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total complaints</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints…"
              defaultValue={search}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              onKeyDown={(e) => e.key === 'Enter' && setFilter('search', e.target.value)}
              onBlur={(e) => setFilter('search', e.target.value)}
            />
          </div>
          <select value={category} onChange={(e) => setFilter('category', e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={priority} onChange={(e) => setFilter('priority', e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none">
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={status} onChange={(e) => setFilter('status', e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-10 bg-gray-50 rounded animate-pulse" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-16 text-center">
              <FileX size={40} className="text-gray-300 mx-auto mb-3" />
              <div className="text-gray-400 font-medium">No complaints match your filters</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    { label: 'ID', col: 'complaint_number' },
                    { label: 'Title', col: null },
                    { label: 'Category', col: null },
                    { label: 'Priority', col: 'priority_score' },
                    { label: 'Status', col: null },
                    { label: 'Department', col: null },
                    { label: 'Date', col: 'created_at' },
                    { label: 'Actions', col: null },
                  ].map(({ label, col }) => (
                    <th key={label} className="text-left px-5 py-3 text-xs font-medium text-gray-500">
                      {col ? (
                        <button className="flex items-center gap-1" onClick={() => toggleSort(col)}>
                          {label} <SortIcon col={col} sortCol={sortCol} sortOrder={sortOrder} />
                        </button>
                      ) : label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    variants={tableRow}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{c.complaint_number}</td>
                    <td className="px-5 py-3 max-w-[200px] truncate text-[#1E293B] font-medium">{c.title}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{c.category}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityClass(c.priority_level)}`}>
                        {c.priority_level || 'Medium'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{c.assigned_department || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/admin/complaints/${c.id}`}
                        className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
