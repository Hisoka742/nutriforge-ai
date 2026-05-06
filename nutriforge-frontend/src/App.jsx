import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from './api'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import Dashboard from './pages/Dashboard'
import NutritionPage from './pages/NutritionPage'
import WorkoutPage from './pages/WorkoutPage'
import SupplementsPage from './pages/SupplementsPage'
import ProgressPage from './pages/ProgressPage'
import ChatPage from './pages/ChatPage'
import Navbar from './components/Navbar'

export default function App() {
  const [token, setToken]           = useState(localStorage.getItem('nf_token'))
  const [user, setUser]             = useState(null)
  const [hasProfile, setHasProfile] = useState(null)
  const [page, setPage]             = useState('dashboard')

  useEffect(() => {
    if (!token) return
    api.get('/users/me').then(r => setUser(r.data)).catch(() => {
      localStorage.removeItem('nf_token')
      setToken(null)
    })
    api.get('/users/profile')
      .then(() => setHasProfile(true))
      .catch(() => setHasProfile(false))
  }, [token])

  function logout() {
    localStorage.removeItem('nf_token')
    setToken(null)
    setUser(null)
    setHasProfile(null)
  }

  if (!token) return (
    <AuthPage onLogin={() => setToken(localStorage.getItem('nf_token'))} />
  )

  if (hasProfile === false) return (
    <OnboardingPage onSave={() => setHasProfile(true)} />
  )

  if (hasProfile === null) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-[#1D9E75] border-t-transparent rounded-full"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar user={user} page={page} setPage={setPage} logout={logout} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}>

            {page === 'dashboard'   && <Dashboard user={user} />}
            {page === 'nutrition'   && <NutritionPage />}
            {page === 'workout'     && <WorkoutPage />}
            {page === 'supplements' && <SupplementsPage />}
            {page === 'progress'    && <ProgressPage />}
            {page === 'chat'        && <ChatPage />}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}