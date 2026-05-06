import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'

const steps = [
  { id: 'basics',    subtitle: 'Tell us about yourself' },
  { id: 'goals',     subtitle: 'What do you want to achieve?' },
  { id: 'lifestyle', subtitle: 'Help us personalise your plan' },
]

const GoalIcon = ({ type }) => {
  const icons = {
    fat_loss:    <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9Z" />,
    muscle_gain: <><path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/></>,
    maintain:    <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></>,
    athlete:     <><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></>,
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {icons[type]}
    </svg>
  )
}

export default function OnboardingPage({ onSave }) {
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({
    gender: 'male', age: 25, weight_kg: 75, height_cm: 175,
    activity_level: 'moderate', goal: 'fat_loss',
    diet_style: 'none', allergies: [],
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function finish() {
    setLoading(true)
    setError('')
    try {
      await api.post('/users/profile', form)
      onSave()
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#1D9E75]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1D9E75] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1D9E75]/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L4 7v10l8 5 8-5V7z"/>
              <path d="M12 7v10M8 9.5l4 2.5 4-2.5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Set up your profile</h1>
          <p className="text-gray-500 text-sm mt-1">Step {step + 1} of {steps.length} — {steps[step].subtitle}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-[#1D9E75] rounded-full"
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.4 }} />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <AnimatePresence mode="wait">

            {/* Step 0 — basics */}
            {step === 0 && (
              <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} className="space-y-5">

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['male', 'Male', <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="14" r="5"/><path d="M19 5l-5.5 5.5M19 5h-4M19 5v4"/></svg>],
                      ['female', 'Female', <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="9" r="5"/><path d="M12 14v6M9 17h6"/></svg>],
                    ].map(([val, label, icon]) => (
                      <button key={val} onClick={() => set('gender', val)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${form.gender === val ? 'border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75]' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[['Age','age','yrs'],['Weight','weight_kg','kg'],['Height','height_cm','cm']].map(([label, key, unit]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                      <div className="relative">
                        <input type="number" value={form[key]}
                          onChange={e => set(key, +e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-[#1D9E75] transition-colors pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1 — goals */}
            {step === 1 && (
              <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">What is your goal?</label>
                {[
                  ['fat_loss',    'Fat loss',            'Burn fat, get lean'],
                  ['muscle_gain', 'Muscle gain',         'Build size and strength'],
                  ['maintain',    'Maintain weight',     'Stay at current weight'],
                  ['athlete',     'Athlete performance', 'Maximize performance'],
                ].map(([val, title, desc]) => (
                  <button key={val} onClick={() => set('goal', val)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${form.goal === val ? 'border-[#1D9E75] bg-[#1D9E75]/10' : 'border-white/10 hover:border-white/20'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${form.goal === val ? 'bg-[#1D9E75]/20 text-[#1D9E75]' : 'bg-white/5 text-gray-400'}`}>
                      <GoalIcon type={val} />
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${form.goal === val ? 'text-[#1D9E75]' : 'text-white'}`}>{title}</div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </div>
                    {form.goal === val && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2 — lifestyle */}
            {step === 2 && (
              <motion.div key="lifestyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} className="space-y-5">

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Activity level</label>
                  <div className="space-y-2">
                    {[
                      ['sedentary',   'Sedentary',      'Desk job, no exercise'],
                      ['light',       'Lightly active', '1-3 days / week'],
                      ['moderate',    'Moderate',       '3-5 days / week'],
                      ['active',      'Very active',    '6-7 days / week'],
                      ['very_active', 'Athlete',        'Physical job or 2x/day'],
                    ].map(([val, title, desc]) => (
                      <button key={val} onClick={() => set('activity_level', val)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${form.activity_level === val ? 'border-[#1D9E75] bg-[#1D9E75]/10' : 'border-white/10 hover:border-white/20'}`}>
                        <div>
                          <span className={`text-sm font-medium ${form.activity_level === val ? 'text-[#1D9E75]' : 'text-white'}`}>{title}</span>
                          <span className="text-xs text-gray-500 ml-2">{desc}</span>
                        </div>
                        {form.activity_level === val && (
                          <div className="w-4 h-4 rounded-full bg-[#1D9E75] flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Diet style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['none',        'No restriction'],
                      ['vegetarian',  'Vegetarian'],
                      ['vegan',       'Vegan'],
                      ['keto',        'Keto'],
                      ['halal',       'Halal'],
                      ['gluten_free', 'Gluten-free'],
                    ].map(([val, label]) => (
                      <button key={val} onClick={() => set('diet_style', val)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${form.diet_style === val ? 'border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75]' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:border-white/20 transition-all">
                Back
              </button>
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finish()}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#1D9E75] hover:bg-[#178A63] text-white text-sm font-semibold transition-all shadow-lg shadow-[#1D9E75]/25 disabled:opacity-50">
              {loading ? 'Saving...' : step < steps.length - 1 ? 'Continue →' : 'Launch my plan'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}