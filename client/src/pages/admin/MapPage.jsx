import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import api from '../../services/api'
import { fadeUp, staggerContainer, staggerChild } from '../../utils/animations'

// Fix Leaflet default icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

const PRIORITY_COLORS = { Critical: '#DC2626', High: '#EA580C', Medium: '#F59E0B', Low: '#16A34A' }

function createIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export default function MapPage() {
  const [complaints, setComplaints] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)
  const [priorityFilter, setPriorityFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    try {
      const [c, h] = await Promise.all([
        api.get('/complaints?limit=100'),
        api.get('/hotspots'),
      ])
      const all = c.data.complaints || c.data || []
      setComplaints(all.filter((x) => x.latitude && x.longitude))
      setHotspots(h.data.hotspots || h.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = complaints.filter((c) => {
    if (priorityFilter === 'all') return true
    return c.priority_level?.toLowerCase() === priorityFilter
  })

  const center = filtered.length > 0
    ? [parseFloat(filtered[0].latitude), parseFloat(filtered[0].longitude)]
    : [20.5937, 78.9629]

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Map & Hotspots</h1>
          <p className="text-sm text-gray-500 mt-0.5">{complaints.length} complaints with location data</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      {/* Legend + filter */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }} className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 text-xs">
          {Object.entries(PRIORITY_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ background: color }} />
              <span className="text-gray-600">{level}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 text-xs rounded-lg font-medium capitalize transition-colors ${
                priorityFilter === p ? 'bg-[#14213D] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        style={{ height: 480 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading map data…</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={filtered.length > 0 ? 12 : 5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hotspots.map((h, i) =>
              h.latitude && h.longitude ? (
                <Circle
                  key={i}
                  center={[parseFloat(h.latitude), parseFloat(h.longitude)]}
                  radius={500}
                  pathOptions={{ color: '#DC2626', fillColor: '#DC2626', fillOpacity: 0.1, weight: 1 }}
                />
              ) : null
            )}
            {filtered.map((c) => (
              <Marker
                key={c.id}
                position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
                icon={createIcon(PRIORITY_COLORS[c.priority_level] || '#6B7280')}
              >
                <Popup>
                  <div className="text-xs min-w-[160px]">
                    <div className="font-mono text-blue-600 mb-0.5">{c.complaint_number}</div>
                    <div className="font-semibold text-gray-800 mb-1">{c.title}</div>
                    <div className="text-gray-500">{c.category}</div>
                    <div className="text-gray-500">{c.status}</div>
                    <a href={`/admin/complaints/${c.id}`} className="mt-1 block text-blue-600 hover:underline">
                      View details →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </motion.div>

      {/* Hotspots list */}
      {hotspots.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" /> Detected Hotspots
          </h2>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {hotspots.map((h, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                className="bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <div className="font-semibold text-[#1E293B] text-sm mb-1">{h.area || `Hotspot ${i + 1}`}</div>
                <div className="text-xs text-gray-500">{h.complaint_count || h.count || ''} complaints nearby</div>
                {h.top_category && (
                  <div className="text-xs text-red-600 mt-1 font-medium">{h.top_category}</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
