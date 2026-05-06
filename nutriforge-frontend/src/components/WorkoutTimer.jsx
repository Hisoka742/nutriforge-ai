import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function WorkoutTimer() {
  const [seconds,  setSeconds]  = useState(0)
  const [running,  setRunning]  = useState(false)
  const [laps,     setLaps]     = useState([])
  const [mode,     setMode]     = useState('stopwatch')
  const [countdownStart, setCountdownStart] = useState(60)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (mode === 'countdown' && s <= 1) {
            setRunning(false)
            return 0
          }
          return mode === 'countdown' ? s - 1 : s + 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function start() {
    if (mode === 'countdown' && seconds === 0) setSeconds(countdownStart)
    setRunning(true)
  }

  function reset() {
    setRunning(false)
    setSeconds(0)
    setLaps([])
  }

  function lap() {
    setLaps(l => [{ time: format(seconds), id: l.length + 1 }, ...l])
  }

  function format(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const progress = mode === 'countdown'
    ? ((countdownStart - seconds) / countdownStart) * 100
    : Math.min(100, (seconds % 60) / 60 * 100)

  const circumference = 2 * Math.PI * 54

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden border border-white/8 rounded-3xl p-6"
      style={{ background: 'linear-gradient(135deg, #378ADD15 0%, #378ADD05 100%)' }}>

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #378ADD40, transparent)' }} />

      <div className="text-xs font-semibold text-[#378ADD] uppercase tracking-widest mb-4">Workout timer</div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        {['stopwatch', 'countdown'].map(m => (
          <button key={m} onClick={() => { setMode(m); reset() }}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all capitalize"
            style={{
              background: mode === m ? '#378ADD20' : '#ffffff08',
              border: mode === m ? '1px solid #378ADD40' : '1px solid #ffffff10',
              color: mode === m ? '#378ADD' : '#6B7280',
            }}>
            {m}
          </button>
        ))}
      </div>

      {/* Countdown presets */}
      {mode === 'countdown' && !running && seconds === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {[30, 60, 90, 120, 180, 300].map(s => (
              <button key={s} onClick={() => setCountdownStart(s)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: countdownStart === s ? '#378ADD20' : '#ffffff08',
                  color: countdownStart === s ? '#378ADD' : '#6B7280',
                  border: countdownStart === s ? '1px solid #378ADD40' : '1px solid transparent',
                }}>
                {s >= 60 ? `${s / 60}m` : `${s}s`}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#ffffff08" strokeWidth="8" />
            <motion.circle cx="60" cy="60" r="54" fill="none"
              stroke="#378ADD" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
              transition={{ duration: 0.5 }}
              style={{ filter: 'drop-shadow(0 0 8px #378ADD80)' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white font-mono">{format(seconds)}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-3">
        {!running ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={start}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #378ADD, #2563EB)' }}>
            {seconds === 0 ? 'Start' : 'Resume'}
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setRunning(false)}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white border border-[#378ADD]/40"
            style={{ background: '#378ADD20' }}>
            Pause
          </motion.button>
        )}
        {mode === 'stopwatch' && running && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={lap}
            className="px-4 py-3 rounded-xl text-sm font-bold text-gray-400 border border-white/10">
            Lap
          </motion.button>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={reset}
          className="px-4 py-3 rounded-xl text-sm font-bold text-gray-400 border border-white/10">
          Reset
        </motion.button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {laps.map(l => (
            <div key={l.id} className="flex justify-between px-3 py-1.5 rounded-lg bg-white/5 text-xs">
              <span className="text-gray-500">Lap {l.id}</span>
              <span className="text-white font-mono font-semibold">{l.time}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}