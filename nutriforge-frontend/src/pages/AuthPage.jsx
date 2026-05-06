import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'

export default function AuthPage({ onLogin }) {
  const [mode, setMode]       = useState('login')
  const [form, setForm]       = useState({ email: '', password: '', name: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await api.post('/users/register', { email: form.email, password: form.password, name: form.name })
        setMode('login')
        setError('')
        return
      }
      const { data } = await api.post('/users/login', { email: form.email, password: form.password })
      localStorage.setItem('nf_token', data.access_token)
      onLogin()
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L4 7v10l8 5 8-5V7z"/>
              <path d="M12 7v10M8 9.5l4 2.5 4-2.5"/>
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-1">NutriForge <span className="text-brand-500">AI</span></h1>
          <p className="text-gray-500 text-sm">Your adaptive fitness intelligence platform</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all relative">
                {mode === m && (
                  <motion.div layoutId="auth-tab"
                    className="absolute inset-0 bg-brand-500 rounded-lg shadow-lg shadow-brand-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className={`relative ${mode === m ? 'text-white' : 'text-gray-500'}`}>
                  {m === 'login' ? 'Sign in' : 'Create account'}
                </span>
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors placeholder-gray-600"
                    placeholder="Your name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors placeholder-gray-600"
                placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors placeholder-gray-600"
                placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Please wait...
                </span>
              ) : mode === 'login' ? 'Sign in' : 'Create account'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}