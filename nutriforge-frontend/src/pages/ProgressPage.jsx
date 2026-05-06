import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

export default function ProgressPage() {
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState(null)
  const [form,    setForm]    = useState({ weight_kg: '', body_fat_pct: '', notes: '' })
  const [msg,     setMsg]     = useState('')
  const [loading, setLoading] = useState(false)

  function load() {
    api.get('/progress/history').then(r => setEntries(r.data.entries || []))
    api.get('/progress/summary').then(r => setSummary(r.data)).catch(() => {})
  }

  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/progress/log', {
        weight_kg:    +form.weight_kg,
        body_fat_pct: form.body_fat_pct ? +form.body_fat_pct : null,
        notes:        form.notes || null,
      })
      setMsg('Progress logged!')
      setForm({ weight_kg: '', body_fat_pct: '', notes: '' })
      load()
      setTimeout(() => setMsg(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">Progress tracker</h1>
        <p className="text-gray-500 mt-1">Log your weight and body composition over time</p>
      </div>

      {/* Summary cards */}
      {summary?.starting_weight && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Starting weight', val: summary.starting_weight + ' kg', color: '#1D9E75', bg: '#1D9E75' },
            { label: 'Current weight',  val: summary.current_weight  + ' kg', color: '#378ADD', bg: '#378ADD' },
            { label: 'Total change',    val: (summary.total_change_kg > 0 ? '+' : '') + summary.total_change_kg + ' kg',
              color: summary.total_change_kg < 0 ? '#1D9E75' : '#D85A30',
              bg:    summary.total_change_kg < 0 ? '#1D9E75' : '#D85A30' },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 border border-white/5"
              style={{ background: c.bg + '15' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: c.color }}>{c.label}</div>
              <div className="text-2xl font-bold text-white">{c.val}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Log form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Log entry</h2>

          {msg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#1D9E75]/10 border border-[#1D9E75]/20 text-[#1D9E75] text-sm rounded-xl px-4 py-3 mb-4">
              {msg}
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Weight (kg)
              </label>
              <input type="number" step="0.1" placeholder="75.5" required
                value={form.weight_kg}
                onChange={e => setForm({ ...form, weight_kg: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1D9E75] transition-colors placeholder-gray-600" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Body fat % <span className="text-gray-600 normal-case">(optional)</span>
              </label>
              <input type="number" step="0.1" placeholder="18.5"
                value={form.body_fat_pct}
                onChange={e => setForm({ ...form, body_fat_pct: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1D9E75] transition-colors placeholder-gray-600" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Notes <span className="text-gray-600 normal-case">(optional)</span>
              </label>
              <input type="text" placeholder="Feeling strong today..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1D9E75] transition-colors placeholder-gray-600" />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#1D9E75] hover:bg-[#178A63] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#1D9E75]/25 disabled:opacity-50">
              {loading ? 'Saving...' : 'Log progress'}
            </motion.button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">History</h2>

          {entries.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No entries yet — log your first weight!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {[...entries].reverse().map((e, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {e.weight_kg} kg
                      {e.body_fat_pct && <span className="text-gray-400 font-normal"> · {e.body_fat_pct}% bf</span>}
                    </div>
                    {e.notes && <div className="text-xs text-gray-500 mt-0.5">{e.notes}</div>}
                  </div>
                  <div className="text-xs text-gray-500">
                    {e.logged_at ? new Date(e.logged_at).toLocaleDateString() : 'Today'}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}