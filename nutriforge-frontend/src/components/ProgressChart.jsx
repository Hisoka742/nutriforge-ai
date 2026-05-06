import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        <div className="text-xs text-gray-400 mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.value} {p.name === 'weight' ? 'kg' : '%'}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function ProgressChart({ entries }) {
  if (!entries || entries.length < 2) return (
    <div className="flex flex-col items-center justify-center h-48 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <p className="text-gray-500 text-sm">Log at least 2 entries to see your chart</p>
    </div>
  )

  const data = entries.map((e, i) => ({
    name: `Entry ${i + 1}`,
    weight: e.weight_kg,
    fat: e.body_fat_pct || null,
  }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Weight progress</div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="weight" name="weight"
            stroke="#1D9E75" strokeWidth={2.5}
            fill="url(#weightGrad)"
            dot={{ fill: '#1D9E75', r: 4, strokeWidth: 2, stroke: '#0a0a0a' }}
            activeDot={{ r: 6, fill: '#1D9E75', stroke: '#0a0a0a', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}