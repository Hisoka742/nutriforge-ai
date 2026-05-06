import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'

export default function NutritionPage() {
  const [macros,   setMacros]   = useState(null)
  const [mealPlan, setMealPlan] = useState(null)
  const [search,   setSearch]   = useState('')
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [tab,      setTab]      = useState('targets')

  useEffect(() => {
    api.get('/users/profile').then(r => {
      const p = r.data
      api.post('/nutrition/macros', p).then(r => setMacros(r.data))
      api.post('/nutrition/meal-plan', p).then(r => setMealPlan(r.data))
    })
  }, [])

  async function searchFood() {
    if (!search.trim()) return
    setLoading(true)
    try {
      const r = await api.post('/nutrition/food/search', { query: search, max_results: 8 })
      setResults(r.data)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'targets', label: 'Targets' },
    { id: 'meals',   label: 'Meal plan' },
    { id: 'search',  label: 'Food search' },
  ]

  const macroData = macros ? [
    { name: 'Calories', val: macros.calories,  unit: 'kcal', color: '#1D9E75', max: 3500 },
    { name: 'Protein',  val: macros.protein_g, unit: 'g',    color: '#378ADD', max: 250  },
    { name: 'Carbs',    val: macros.carbs_g,   unit: 'g',    color: '#BA7517', max: 400  },
    { name: 'Fat',      val: macros.fat_g,     unit: 'g',    color: '#D85A30', max: 120  },
    { name: 'Fiber',    val: macros.fiber_g,   unit: 'g',    color: '#7F77DD', max: 40   },
  ] : []

  const mealIcons = {
    breakfast: { icon: '🌅', color: '#BA7517' },
    lunch:     { icon: '☀️',  color: '#1D9E75' },
    dinner:    { icon: '🌙', color: '#378ADD' },
    snacks:    { icon: '🍎', color: '#D85A30' },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#1D9E75]/8 rounded-full blur-3xl pointer-events-none" />
        <p className="text-[#1D9E75] text-xs font-semibold tracking-widest uppercase mb-2">AI-powered</p>
        <h1 className="text-4xl font-bold text-white">Nutrition</h1>
        <p className="text-gray-500 mt-2">Your daily targets, meal plan and food database</p>
      </div>

      {/* Tabs */}
      <div className="relative flex gap-1 bg-white/5 rounded-2xl p-1.5 w-fit border border-white/5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {tab === t.id && (
              <motion.div layoutId="nutrition-tab"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #1D9E75, #178A63)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                <div className="absolute top-0 left-2 right-2 h-px rounded-full bg-white/30" />
              </motion.div>
            )}
            <span className={`relative ${tab === t.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Targets */}
        {tab === 'targets' && macros && (
          <motion.div key="targets"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}>

            <div className="relative overflow-hidden border border-white/8 rounded-3xl p-8"
              style={{ background: 'linear-gradient(135deg, #ffffff06 0%, #ffffff02 100%)' }}>

              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #ffffff15, transparent)' }} />

              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">
                Daily macro targets
              </div>

              <div className="space-y-6">
                {macroData.map((m, i) => (
                  <div key={m.name}>
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                        <span className="text-sm font-semibold text-white">{m.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold" style={{ color: m.color }}>{m.val}</span>
                        <span className="text-xs text-gray-500">{m.unit}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full relative"
                        style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}80)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (m.val / m.max) * 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-lg" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: '#06B6D415' }}>
                  <div className="w-9 h-9 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-[#06B6D4] font-semibold uppercase tracking-wider">Daily water target</div>
                    <div className="text-lg font-bold text-white">{macros.water_ml} ml</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Meal plan */}
        {tab === 'meals' && mealPlan && (
          <motion.div key="meals"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative overflow-hidden border border-white/8 rounded-3xl p-8"
            style={{ background: 'linear-gradient(135deg, #ffffff06 0%, #ffffff02 100%)' }}>

            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #ffffff15, transparent)' }} />

            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">
              Sample day meal plan
            </div>

            <div className="space-y-4">
              {Object.entries(mealPlan.sample_day || {}).map(([meal, desc], i) => {
                const config = mealIcons[meal] || { color: '#1D9E75' }
                return (
                  <motion.div key={meal}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden flex gap-5 p-5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
                    style={{ background: `linear-gradient(135deg, ${config.color}10 0%, transparent 100%)` }}>

                    <div className="absolute top-0 left-0 bottom-0 w-px"
                      style={{ background: `linear-gradient(180deg, transparent, ${config.color}, transparent)` }} />

                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: config.color + '20' }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: config.color }} />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-bold uppercase tracking-widest mb-1.5"
                        style={{ color: config.color }}>{meal}</div>
                      <div className="text-sm text-gray-300 leading-relaxed">{desc}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 p-4 rounded-2xl border border-[#1D9E75]/10"
              style={{ background: '#1D9E7508' }}>
              <p className="text-xs text-gray-500 leading-relaxed">{mealPlan.note}</p>
            </div>
          </motion.div>
        )}

        {/* Food search */}
        {tab === 'search' && (
          <motion.div key="search"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative overflow-hidden border border-white/8 rounded-3xl p-8"
            style={{ background: 'linear-gradient(135deg, #ffffff06 0%, #ffffff02 100%)' }}>

            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #ffffff15, transparent)' }} />

            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
              Food database
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#1D9E75]/50 transition-all placeholder-gray-600"
                  placeholder="Search food (e.g. chicken breast, oats...)"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchFood()}
                />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={searchFood} disabled={loading}
                className="px-6 py-3.5 rounded-2xl text-white text-sm font-bold transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1D9E75, #178A63)' }}>
                {loading ? (
                  <motion.div animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : 'Search'}
              </motion.button>
            </div>

            {results && (
              <div className="space-y-2">
                {(results.mock_result?.foods || results.foods || []).map((f, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                    style={{ background: 'linear-gradient(135deg, #ffffff06, #ffffff02)' }}>
                    <span className="text-sm font-semibold text-white group-hover:text-[#1D9E75] transition-colors">
                      {f.name}
                    </span>
                    <div className="flex gap-4 text-xs">
                      <span className="font-bold" style={{ color: '#1D9E75' }}>
                        {f.calories || f.calories_per_100g} kcal
                      </span>
                      <span className="text-gray-500">P: {f.protein_g}g</span>
                      <span className="text-gray-500">C: {f.carbs_g}g</span>
                      <span className="text-gray-500">F: {f.fat_g}g</span>
                    </div>
                  </motion.div>
                ))}
                {results.message && (
                  <p className="text-xs text-gray-600 mt-3 px-2">{results.message}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}