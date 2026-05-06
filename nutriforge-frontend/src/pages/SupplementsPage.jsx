import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

export default function SupplementsPage() {
  const [plan,    setPlan]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/profile').then(r => {
      return api.post('/supplements/plan', r.data)
    }).then(r => setPlan(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-[#1D9E75] border-t-transparent rounded-full" />
    </div>
  )

  const priorityConfig = {
    essential:   { color: '#1D9E75', bg: '#1D9E75' + '15', label: 'Essential' },
    recommended: { color: '#378ADD', bg: '#378ADD' + '15', label: 'Recommended' },
    optional:    { color: '#BA7517', bg: '#BA7517' + '15', label: 'Optional' },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">Supplements</h1>
        <p className="text-gray-500 mt-1">Evidence-based recommendations personalised for your profile</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        {Object.entries(priorityConfig).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: val.color }} />
            <span className="text-xs text-gray-400">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Supplement cards */}
      {plan && (
        <div className="space-y-3">
          {plan.supplements.map((sup, i) => {
            const config = priorityConfig[sup.priority] || priorityConfig.optional
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{sup.name}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ml-3"
                    style={{ background: config.bg, color: config.color }}>
                    {config.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dose</div>
                    <div className="text-sm font-semibold text-white">{sup.dose}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timing</div>
                    <div className="text-sm font-semibold text-white">{sup.timing}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed">{sup.reason}</p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Notes */}
      {plan && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-[#BA7517]/10 border border-[#BA7517]/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <span className="text-sm font-semibold text-[#BA7517]">Important note</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{plan.notes}</p>
        </motion.div>
      )}
    </motion.div>
  )
}