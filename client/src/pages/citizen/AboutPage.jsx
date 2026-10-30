import { motion } from 'framer-motion'
import { AlertTriangle, Brain, MapPin, Zap, CheckCircle, Users, Building2, BarChart2 } from 'lucide-react'
import { fadeUp, viewport } from '../../utils/animations'

const PROBLEM_TEXT =
  'Citizens face frustrating civic issues daily – potholes, drainage failures, streetlights out, garbage piling up. The existing complaint systems are fragmented, opaque, and slow. Complaints get lost. Duplicate reports waste municipal resources. Priority is unclear. Citizens never know what happened to their report.'

const SOLUTION_TEXT =
  'CivicAI addresses this by providing an end-to-end intelligent platform that automates classification, duplicate detection, priority scoring, and resolution tracking for every civic complaint.'

const FEATURES = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Gemini AI automatically categorizes and summarizes every complaint.' },
  { icon: Zap, title: 'Priority Scoring', desc: 'Every complaint gets an explainable priority score based on safety, urgency, and impact.' },
  { icon: MapPin, title: 'Geolocation Mapping', desc: 'Map view of all complaints with hotspot detection for recurring problem areas.' },
  { icon: CheckCircle, title: 'Resolution Tracking', desc: 'Citizens can track their complaint from submission to resolution with a unique ID.' },
  { icon: Users, title: 'Citizen Empowerment', desc: 'Simple reporting UI lets anyone submit complaints, no technical knowledge needed.' },
  { icon: Building2, title: 'Department Assignment', desc: 'Smart routing sends complaints to the right municipal department automatically.' },
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Admins get real-time trend data, category breakdowns, and resolution metrics.' },
  { icon: AlertTriangle, title: 'Duplicate Detection', desc: 'AI identifies and groups similar complaints to avoid redundant field visits.' },
]

const TECH_STACK = [
  { name: 'React + Vite', desc: 'Fast, modular frontend', color: 'bg-blue-50 text-blue-700' },
  { name: 'Node.js + Express', desc: 'RESTful API backend', color: 'bg-green-50 text-green-700' },
  { name: 'Supabase (PostgreSQL)', desc: 'Persistent database', color: 'bg-purple-50 text-purple-700' },
  { name: 'Google Gemini AI', desc: 'AI complaint analysis', color: 'bg-orange-50 text-orange-700' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling', color: 'bg-cyan-50 text-cyan-700' },
  { name: 'Framer Motion', desc: 'Smooth animations', color: 'bg-pink-50 text-pink-700' },
]

export default function AboutPage() {
  return (
    <div className="bg-[#F5F7FB]">
      {/* Hero */}
      <section className="bg-[#14213D] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium mb-6">
              Hackathon Project – From Complaints to Action
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About CivicAI</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              An AI-powered civic complaint management platform built to transform scattered citizen complaints into intelligent, prioritized, and trackable civic actions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#1E293B]">The Problem</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">{PROBLEM_TEXT}</p>
              <p className="text-gray-600 leading-relaxed">{SOLUTION_TEXT}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Key Features</h2>
            <p className="text-gray-500">Everything needed to manage civic complaints intelligently</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={viewport}
                className="flex gap-4 p-5 bg-[#F5F7FB] rounded-xl border border-gray-100"
              >
                <div className="w-9 h-9 bg-[#14213D] rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E293B] mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Tech Stack</h2>
            <p className="text-gray-500">Built with modern, scalable technologies</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TECH_STACK.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={viewport}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <div className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 ${t.color}`}>
                  {t.name}
                </div>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700"
          >
            <strong>Hackathon Disclaimer:</strong> CivicAI is a demonstration project built for educational purposes.
            All data shown is synthetic. This platform is not affiliated with any government body or municipality.
          </motion.div>
        </div>
      </section>
    </div>
  )
}
