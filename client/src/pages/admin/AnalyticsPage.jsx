import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie, AreaChart, Area, ResponsiveContainer,
} from 'recharts'
import api from '../../services/api'
import { fadeUp, staggerContainer, staggerChild } from '../../utils/animations'
import { useCountUp } from '../../hooks/useCountUp'

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#7C3AED', '#0891B2', '#DB2777', '#EA580C']
const PIE_COLORS = ['#16A34A', '#F59E0B', '#EA580C', '#DC2626']

function StatCard({ label, value, color, loading }) {
  const count = useCountUp(value, 1100, !loading)
  return (
    <motion.div variants={staggerChild} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`text-3xl font-bold mb-1 ${color}`}>
        {loading ? <span className="text-gray-300 animate-pulse">—</span> : count}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/analytics')
      setData(res.data)
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
  const byDept = data?.byDepartment || []

  const stats = [
    { label: 'Total', value: summary.total || 0, color: 'text-blue-600' },
    { label: 'Resolved', value: summary.resolved || 0, color: 'text-green-600' },
    { label: 'Critical', value: summary.critical || 0, color: 'text-red-600' },
    { label: 'Avg Score', value: summary.avgScore ? Math.round(summary.avgScore) : 0, color: 'text-purple-600' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Civic complaint trends and insights</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} loading={loading} />)}
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">Complaints by Category</h2>
          {loading ? (
            <div className="h-52 bg-gray-50 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byCategory} margin={{ top: 5, right: 10, bottom: 50, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">Priority Distribution</h2>
          {loading ? (
            <div className="h-52 bg-gray-50 rounded animate-pulse" />
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={byPriority} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="priority">
                    {byPriority.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % 4]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {byPriority.map((item, i) => (
                  <div key={item.priority} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i % 4] }} />
                    <span className="text-xs text-gray-600">{item.priority}: <strong>{item.count}</strong></span>
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
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">Weekly Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekly}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} fill="url(#blueGrad)" dot={{ r: 3, fill: '#2563EB' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* By department */}
      {byDept.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 className="font-semibold text-[#1E293B] mb-4">By Department</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byDept} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  )
}
