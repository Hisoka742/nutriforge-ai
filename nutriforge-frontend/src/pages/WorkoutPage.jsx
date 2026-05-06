import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'

export default function WorkoutPage() {
  const [plan,     setPlan]     = useState(null)
  const [selected, setSelected] = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/users/profile').then(r => {
      const profile = r.data
      return api.post('/workout/plan', profile, {
        params: { sessions_per_week: 4, equipment: 'full_gym' }
      })
    }).then(r => setPlan(r.data))
      .catch(() => {
        // try direct call
        api.get('/users/profile').then(r => {
          const p = r.data
          return fetch('http://127.0.0.1:8000/api/workout/plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('nf_token')}`
            },
            body: JSON.stringify(p)
          }).then(res => res.json()).then(data => setPlan(data))
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-[#1D9E75] border-t-transparent rounded-full" />
    </div>
  )

  if (!plan || !plan.plan) return (
    <div className="text-gray-500 text-center py-20">Could not load workout plan.</div>
  )

  const day = plan.plan[selected]

  const muscleColors = {
    chest: '#D85A30', back: '#378ADD', shoulders: '#7F77DD',
    legs: '#1D9E75', glutes: '#BA7517', arms: '#D85A30',
    core: '#7F77DD', cardio_hiit: '#1D9E75',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">Workout plan</h1>
        <p className="text-gray-500 mt-1">
          {plan.weeks}-week programme · {plan.sessions_per_week} sessions/week · {plan.difficulty}
        </p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 flex-wrap">
        {plan.plan.map((d, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all">
            {selected === i && (
              <motion.div layoutId="day-pill"
                className="absolute inset-0 bg-[#1D9E75] rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className={`relative ${selected === i ? 'text-white' : 'text-gray-400'}`}>
              {d.day_name}
            </span>
          </button>
        ))}
      </div>

      {/* Day detail */}
      <AnimatePresence mode="wait">
        <motion.div key={selected}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{day.session_type}</h2>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  {day.duration_minutes} min
                </span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  ~{day.calories_burned} kcal burned
                </span>
              </div>
            </div>
            <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-[#1D9E75]">{day.exercises.length} exercises</span>
            </div>
          </div>

          <div className="space-y-3">
            {day.exercises.map((ex, i) => {
              const color = muscleColors[ex.muscle_group] || '#1D9E75'
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: color + '20', color }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{ex.name}</div>
                    <div className="text-xs text-gray-500 capitalize mt-0.5">
                      {ex.muscle_group} · {ex.equipment}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-white">{ex.sets} × {ex.reps}</div>
                    <div className="text-xs text-gray-500">Rest {ex.rest_seconds}s</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}