import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, AlertTriangle, CheckCircle, Loader2, X, Upload, Map } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import api from '../../services/api'
import { fadeUp, heightCollapse } from '../../utils/animations'

const CATEGORIES = [
  'Road Damage', 'Waterlogging', 'Waste Management',
  'Streetlight Issues', 'Drainage Problems', 'Water Supply',
  'Public Safety', 'Other',
]

const INITIAL_FORM = {
  title: '', description: '', category: '', address: '',
  latitude: '', longitude: '', image: null, imagePreview: null,
}

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function ReportPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [serverError, setServerError] = useState('')
  const fileRef = useRef()

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim() || form.description.length < 20)
      e.description = 'Please provide at least 20 characters'
    if (!form.category) e.category = 'Select a category'
    if (!form.address.trim()) e.address = 'Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Only JPG/PNG allowed' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'File must be under 5MB' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setField('imagePreview', ev.target.result)
    reader.readAsDataURL(file)
    setField('image', file)
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  const clearImage = () => {
    setField('image', null)
    setField('imagePreview', null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleMapClick = (lat, lng) => {
    setField('latitude', lat.toFixed(6))
    setField('longitude', lng.toFixed(6))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setServerError('')
    try {
      const fd = new FormData()
      fd.append('title', form.title.trim())
      fd.append('description', form.description.trim())
      fd.append('category', form.category)
      fd.append('address', form.address.trim())
      if (form.latitude) fd.append('latitude', form.latitude)
      if (form.longitude) fd.append('longitude', form.longitude)
      if (form.image) fd.append('image', form.image)
      const res = await api.post('/complaints', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitted(res.data)
      setForm(INITIAL_FORM)
      if (fileRef.current) fileRef.current.value = ''
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setServerError(err.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const complaint = submitted.complaint || submitted
    const trackingId = complaint.complaint_number || submitted.complaintNumber
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 20 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle size={32} className="text-green-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Complaint Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Your complaint has been received and AI analysis is in progress.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
              <div className="text-sm text-blue-600 font-medium mb-1">Your Tracking ID</div>
              <div className="text-3xl font-bold text-[#2563EB] tracking-wider font-mono">
                {trackingId}
              </div>
              <div className="text-xs text-blue-500 mt-2">Save this ID to track your complaint</div>
            </div>
            {complaint.ai_summary && (
              <div className="bg-gray-50 rounded-lg p-3 text-left mb-3">
                <div className="font-medium text-gray-700 mb-1">AI Summary:</div>
                <div className="text-gray-600 text-sm">{complaint.ai_summary}</div>
              </div>
            )}
            {complaint.priority_level && (
              <div className="flex items-center justify-between mt-3 px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Priority Level:</span>
                <span
                  className={`font-semibold text-sm ${
                    complaint.priority_level === 'Critical'
                      ? 'text-red-600'
                      : complaint.priority_level === 'High'
                      ? 'text-orange-600'
                      : complaint.priority_level === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {complaint.priority_level}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setSubmitted(null)}
                className="flex-1 py-2.5 border border-gray-200 text-sm font-medium text-[#1E293B] rounded-xl hover:bg-gray-50 transition-colors"
              >
                Submit Another
              </button>
              <Link
                to={`/track?id=${trackingId}`}
                className="flex-1 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors text-center"
              >
                Track Complaint
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Report a Civic Issue</h1>
            <p className="text-gray-500">Fill in the details below. Our AI will analyze and prioritize your complaint.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <AnimatePresence>
              {serverError && (
                <motion.div
                  variants={heightCollapse}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700"
                >
                  <AlertTriangle size={15} />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="E.g., Large pothole on MG Road"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors ${
                    errors.title ? 'border-red-300' : 'border-gray-200 focus:border-blue-400'
                  }`}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors bg-white ${
                    errors.category ? 'border-red-300' : 'border-gray-200 focus:border-blue-400'
                  }`}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Describe the issue in detail. Include when it started, how severe it is, etc."
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-200 focus:border-blue-400'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-400 ml-auto">{form.description.length} chars</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="Street address, landmark, area…"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors ${
                    errors.address ? 'border-red-300' : 'border-gray-200 focus:border-blue-400'
                  }`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              {/* Lat/Lng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => setField('latitude', e.target.value)}
                    placeholder="20.5937"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => setField('longitude', e.target.value)}
                    placeholder="78.9629"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              {/* Map picker */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5 flex items-center gap-1.5">
                  <Map size={14} /> Pin Location on Map
                </label>
                <div className="rounded-xl overflow-hidden border border-gray-200 h-52">
                  <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker onLocationSelect={handleMapClick} />
                    {form.latitude && form.longitude && (
                      <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]} />
                    )}
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-400 mt-1">Click on the map to set coordinates automatically</p>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Photo (optional)
                </label>
                {form.imagePreview ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full max-h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    >
                      <X size={14} className="text-gray-600" />
                    </button>
                  </motion.div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                    <Upload size={22} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload JPG/PNG (max 5MB)</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className="w-full py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
