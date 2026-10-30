import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Clock, AlertTriangle, Activity, CheckCircle, RefreshCw, ArrowRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
} from 'recharts'
import api from '../../services/api'
import { fadeUp, staggerContainer, staggerChild, tableRow, viewport } from '../../utils/animations'
import { useCountUp } from '../../hooks/useCountUp'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

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
  return 'bg-gray-100 text-gray-600'
}

function StatCard({ label, value, icon: Icon, color, border, loading, index }) {
  const count = useCountUp(value, 1100, !loading)
  return (
    <motion.div
      variants={staggerChild}
      className={`bg-white rounded-xl border ${border} p-5 shadow-sm`}
    >
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

const PIE_COLORS = ['#16A34A', '#F59E0B', '#EA580C', '#DC2626']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [analytics, complaints] = await Promise.all([
        api.get('/analytics'),
        api.get('/complaints?limit=5&sort=created_at&order=desc'),
      ])
      setData(analytics.data)
      setRecent(complaints.data.complaints || complaints.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const summary = data?.summary || {}
  const byCategory = data?.byCategory || []
  const byPriority = data?.byPriority || []
  const weekly = data?.weekly || []

  const stats = [
    { label: 'Total Complaints', value: summary.total || 0, icon: TrendingUp, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Pending', value: summary.pending || 0, icon: Clock, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
    { label: 'High Priority', value: summary.high || 0, icon: AlertTriangle, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
    { label: 'In Progress', value: summary.inProgress || 0, icon: Activity, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { label: 'Resolved', value: summary.resolved || 0, icon: CheckCircle, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Overview Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time civic complaint intelligence</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">Complaints by Category</h2>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byCategory} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">Priority Distribution</h2>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie
                    data={byPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="count"
                    nameKey="priority"
                  >
                    {byPriority.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {byPriority.map((item, i) => (
                  <div key={item.priority} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i % 4] }} />
                    <span className="text-xs text-gray-600">
                      {item.priority}: <strong>{item.count}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Weekly trend */}
      {weekly.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">Weekly Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={{ r: 4, fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent complaints table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-[#1E293B]">Recent Complaints</h2>
          <Link
            to="/admin/complaints"
            className="text-sm text-[#2563EB] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-10 bg-gray-50 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['ID', 'Title', 'Category', 'Priority', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    variants={tableRow}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-blue-600">{c.complaint_number}</td>
                    <td className="px-5 py-3 max-w-[200px] truncate text-[#1E293B]">{c.title}</td>
                    <td className="px-5 py-3 text-gray-600">{c.category}</td>
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
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.created_at)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}
