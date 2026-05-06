import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import WaterTracker from '../components/WaterTracker'
import WorkoutTimer from '../components/WorkoutTimer'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

function StatCard({ label, val, unit, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl p-5 border border-white/10 group cursor-default"
      style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}05 100%)` }}>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ background: color }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />
      <div className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: color + 'aa' }}>{label}</div>
      <div className="text-3xl font-bold text-white">
        {val}
        <span className="text-sm font-normal ml-1" style={{ color: color + '80' }}>{unit}</span>
      </div>
    </motion.div>
  )
}

function MLCard({ mlData, loading }) {
  if (loading) return (
    <motion.div variants={item}
      className="relative overflow-hidden rounded-3xl border border-[#7F77DD]/20 p-8"
      style={{ background: 'linear-gradient(135deg, #7F77DD18 0%, #7F77DD05 100%)' }}>
      <div className="text-xs font-semibold text-[#7F77DD] uppercase tracking-widest mb-4">AI Analysis</div>
      <div className="flex items-center gap-3 text-gray-500">
        <div className="w-4 h-4 border-2 border-[#7F77DD] border-t-transparent rounded-full animate-spin" />
        Running ML models on your profile...
      </div>
    </motion.div>
  )

  if (!mlData) return null

  const riskColor = mlData.health_risk === 'Low' ? '#1D9E75' : mlData.health_risk === 'Medium' ? '#BA7517' : '#D85A30'
  const intensityColor = mlData.workout_intensity === 'Light' ? '#378ADD'
    : mlData.workout_intensity === 'Moderate' ? '#1D9E75'
    : mlData.workout_intensity === 'Active' ? '#BA7517' : '#D85A30'

  return (
    <motion.div variants={item}
      className="relative overflow-hidden rounded-3xl border border-[#7F77DD]/20 p-8"
      style={{ background: 'linear-gradient(135deg, #7F77DD18 0%, #7F77DD05 50%, #378ADD08 100%)' }}>

      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7F77DD]/10 rounded-full blur-3xl" />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7F77DD60, #378ADD40, transparent)' }} />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-[#7F77DD]/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#7F77DD] uppercase tracking-widest">ML Predictions</div>
            <div className="text-xs text-gray-600 mt-0.5">Trained on real Kaggle fitness data</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Calories / session', val: mlData.calories_burned_session, unit: 'kcal', color: '#1D9E75' },
            { label: 'Daily protein',      val: mlData.daily_protein_g,         unit: 'g',    color: '#378ADD' },
            { label: 'Daily carbs',        val: mlData.daily_carbs_g,           unit: 'g',    color: '#BA7517' },
            { label: 'Daily fat',          val: mlData.daily_fat_g,             unit: 'g',    color: '#D85A30' },
          ].map(({ label, val, unit, color }) => (
            <div key={label} className="rounded-2xl p-4 border border-white/8"
              style={{ background: `linear-gradient(135deg, ${color}12 0%, ${color}04 100%)` }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: color + 'aa' }}>{label}</div>
              <div className="text-2xl font-bold text-white">
                {val}
                <span className="text-xs font-normal ml-1" style={{ color: color + '80' }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border border-white/8"
            style={{ background: 'linear-gradient(135deg, #ffffff08 0%, #ffffff03 100%)' }}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Daily calories</div>
            <div className="text-2xl font-bold text-white">{mlData.daily_calories_target}
              <span className="text-xs font-normal ml-1 text-gray-600">kcal</span>
            </div>
          </div>

          <div className="rounded-2xl p-4 border border-white/8"
            style={{ background: `linear-gradient(135deg, ${riskColor}12 0%, ${riskColor}04 100%)` }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: riskColor + 'aa' }}>Health risk</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: riskColor }} />
              <span className="text-xl font-bold" style={{ color: riskColor }}>{mlData.health_risk}</span>
            </div>
          </div>

          <div className="rounded-2xl p-4 border border-white/8"
            style={{ background: `linear-gradient(135deg, ${intensityColor}12 0%, ${intensityColor}04 100%)` }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: intensityColor + 'aa' }}>Workout level</div>
            <div className="text-xl font-bold" style={{ color: intensityColor }}>{mlData.workout_intensity}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard({ user }) {
  const [macros,  setMacros]  = useState(null)
  const [bmi,     setBmi]     = useState(null)
  const [profile, setProfile] = useState(null)
  const [mlData,  setMlData]  = useState(null)
  const [mlLoading, setMlLoading] = useState(false)

  useEffect(() => {
    api.get('/users/profile').then(r => {
      const p = r.data
      setProfile(p)
      api.post('/nutrition/macros', p).then(r => setMacros(r.data))
      api.get(`/nutrition/bmi?weight_kg=${p.weight_kg}&height_cm=${p.height_cm}`)
        .then(r => setBmi(r.data))

      const expMap = { sedentary: 1, light: 1, moderate: 2, active: 3, very_active: 3 }
      const goalMap = { lose_weight: 0, maintain: 1, gain_muscle: 2 }
      const expKey = (p.activity_level || '').toLowerCase()
      const goalKey = (p.goal || '').toLowerCase()

      setMlLoading(true)
      api.post('/ml/predict', {
        gender:           p.gender || 'male',
        age:              p.age || 25,
        weight_kg:        p.weight_kg || 70,
        height_cm:        p.height_cm || 170,
        experience_level: expMap[expKey] || 2,
        goal:             goalMap[goalKey] ?? 1,
        session_hours:    1.0,
        avg_bpm:          130,
        resting_bpm:      65,
      })
        .then(r => setMlData(r.data))
        .finally(() => setMlLoading(false))
    })
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      <motion.div variants={item} className="relative">
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-[#1D9E75]/10 rounded-full blur-3xl pointer-events-none" />
        <p className="text-[#1D9E75] text-xs font-semibold tracking-widest uppercase mb-2">{greeting}</p>
        <h1 className="text-5xl font-bold text-white leading-tight">
          Welcome back, <br />
          <span className="bg-gradient-to-r from-[#1D9E75] to-[#378ADD] bg-clip-text text-transparent">
            {user?.name?.split(' ')[0]}
          </span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Your personalised fitness overview for today</p>
      </motion.div>

      {bmi && (
        <motion.div variants={item}
          className="relative overflow-hidden rounded-3xl border border-[#1D9E75]/20 p-8"
          style={{ background: 'linear-gradient(135deg, #1D9E7518 0%, #1D9E7505 50%, #378ADD08 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D9E75]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#378ADD]/8 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #1D9E7560, #378ADD40, transparent)' }} />
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="text-xs font-semibold text-[#1D9E75] uppercase tracking-widest mb-2">Body Mass Index</div>
              <div className="text-7xl font-bold text-white mb-2">{bmi.bmi}</div>
              <div className="inline-flex items-center gap-2 bg-[#1D9E75]/15 border border-[#1D9E75]/25 rounded-full px-4 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                <span className="text-sm font-semibold text-[#1D9E75]">{bmi.category}</span>
              </div>
            </div>
            <div className="flex-1 min-w-48 max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Underweight</span><span>Obese</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #378ADD, #1D9E75, #BA7517, #D85A30)' }}>
                <motion.div
                  className="h-full w-1 bg-white rounded-full shadow-lg"
                  initial={{ marginLeft: 0 }}
                  animate={{ marginLeft: `${Math.min(90, Math.max(5, ((bmi.bmi - 15) / 25) * 100))}%` }}
                  transition={{ duration: 1, delay: 0.5 }} />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <MLCard mlData={mlData} loading={mlLoading} />

      {macros && (
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Daily targets</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Calories', val: macros.calories,  unit: 'kcal', color: '#1D9E75', delay: 0.1  },
              { label: 'Protein',  val: macros.protein_g, unit: 'g',    color: '#378ADD', delay: 0.15 },
              { label: 'Carbs',    val: macros.carbs_g,   unit: 'g',    color: '#BA7517', delay: 0.2  },
              { label: 'Fat',      val: macros.fat_g,     unit: 'g',    color: '#D85A30', delay: 0.25 },
              { label: 'Fiber',    val: macros.fiber_g,   unit: 'g',    color: '#7F77DD', delay: 0.3  },
              { label: 'Water',    val: macros.water_ml,  unit: 'ml',   color: '#06B6D4', delay: 0.35 },
            ].map(m => <StatCard key={m.label} {...m} />)}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WaterTracker target={macros?.water_ml || 2625} />
        <WorkoutTimer />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Quick actions</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Meal plan',    desc: 'View your AI-generated meals',  color: '#1D9E75',
              icon: <><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/></> },
            { title: 'Workout',      desc: "Today's training session",       color: '#378ADD',
              icon: <><path d="M6 4v16M18 4v16M6 12h12"/><path d="M3 8h3M18 8h3M3 16h3M18 16h3"/></> },
            { title: 'Supplements',  desc: 'Your daily stack',              color: '#7F77DD',
              icon: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/> },
            { title: 'Log progress', desc: 'Track your body stats',         color: '#D85A30',
              icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
          ].map((a, i) => (
            <motion.div key={i}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden border border-white/8 rounded-2xl p-5 cursor-pointer group"
              style={{ background: 'linear-gradient(135deg, #ffffff08 0%, #ffffff03 100%)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${a.color}10 0%, transparent 100%)` }} />
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${a.color}60, transparent)` }} />
              <div className="relative flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: a.color + '20' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke={a.color} strokeWidth="2" strokeLinecap="round">
                    {a.icon}
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{a.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {profile && (
        <motion.div variants={item}
          className="relative overflow-hidden border border-white/8 rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, #ffffff06 0%, #ffffff02 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #ffffff15, transparent)' }} />
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">Your profile</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              ['Gender',   profile.gender],
              ['Age',      profile.age + ' yrs'],
              ['Weight',   profile.weight_kg + ' kg'],
              ['Height',   profile.height_cm + ' cm'],
              ['Goal',     profile.goal?.replace(/_/g, ' ')],
              ['Activity', profile.activity_level?.replace(/_/g, ' ')],
            ].map(([label, val]) => (
              <div key={label} className="group">
                <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider">{label}</div>
                <div className="text-sm font-bold text-white capitalize group-hover:text-[#1D9E75] transition-colors">{val}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  )
}