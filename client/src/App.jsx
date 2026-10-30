import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './services/AuthContext'

import CitizenLayout from './layouts/CitizenLayout'
import AdminLayout from './layouts/AdminLayout'

import HomePage from './pages/citizen/HomePage'
import ReportPage from './pages/citizen/ReportPage'
import TrackPage from './pages/citizen/TrackPage'
import AboutPage from './pages/citizen/AboutPage'
import LoginPage from './pages/citizen/LoginPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AllComplaintsPage from './pages/admin/AllComplaintsPage'
import ComplaintDetailPage from './pages/admin/ComplaintDetailPage'
import AIIntelligencePage from './pages/admin/AIIntelligencePage'
import MapPage from './pages/admin/MapPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import AssignmentsPage from './pages/admin/AssignmentsPage'
import SettingsPage from './pages/admin/SettingsPage'

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<CitizenLayout />}>
          <Route index element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="track" element={<TrackPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AllComplaintsPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage />} />
          <Route path="ai" element={<AIIntelligencePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
