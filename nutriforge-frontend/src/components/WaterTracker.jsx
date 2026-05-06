import { useState } from 'react'
import { motion } from 'framer-motion'

export default function WaterTracker({ target = 2625 }) {
  const [glasses, setGlasses] = useState(0)
  const glassML = 250
  const total = glasses * glassML
  const pct = Math.min(100, (total / target) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden border border-white/8 rounded-3xl p-6"
      style={{ background: 'linear-gradient(135deg, #06B6D415 0%, #06B6D405 100%)' }}>

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #06B6D440, transparent)' }} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs font-semibold text-[#06B6D4] uppercase tracking-widest mb-1">Water intake</div>
          <div className="text-3xl font-bold text-white">{total}
            <span className="text-sm font-normal text-gray-500 ml-1">/ {target} ml</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2C6 2 2 7 2 12a10 10 0 0 0 20 0c0-5-4-10-10-10z"/>
          </svg>
        </div>
      </div>

      {/* Water fill visual */}
      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-4">
        <motion.div className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #06B6D4, #0891B2)' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }} />
        {pct >= 100 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">Goal reached! 🎉</span>
          </motion.div>
        )}
      </div>

      {/* Glasses grid */}
      <div className="grid grid-cols-8 gap-2 mb-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.button key={i}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setGlasses(i < glasses ? i : i + 1)}
            className="aspect-square rounded-xl flex items-center justify-center transition-all"
            style={{
              background: i < glasses ? '#06B6D420' : '#ffffff08',
              border: i < glasses ? '1px solid #06B6D440' : '1px solid #ffffff10',
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={i < glasses ? '#06B6D4' : 'none'}
              stroke={i < glasses ? '#06B6D4' : '#ffffff30'} strokeWidth="2" strokeLinecap="round">
              <path d="M5 3h14l-2 16H7L5 3z"/>
              <path d="M5 8h14"/>
            </svg>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setGlasses(g => Math.min(8, g + 1))}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }}>
          + Add glass (250ml)
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setGlasses(0)}
          className="px-4 py-2.5 rounded-xl text-sm text-gray-400 border border-white/10 hover:border-white/20 transition-all">
          Reset
        </motion.button>
      </div>
    </motion.div>
  )
}