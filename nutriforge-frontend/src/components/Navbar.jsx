import { motion } from 'framer-motion'

const links = [
  { id: 'dashboard',   label: 'Dashboard',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id: 'nutrition',   label: 'Nutrition',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11a9 9 0 0 1 9-9z"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'workout',     label: 'Workout',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/></svg> },
  { id: 'supplements', label: 'Supplements',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
  { id: 'progress',    label: 'Progress',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: 'chat',        label: 'AI Chat',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
]

export default function Navbar({ user, page, setPage, logout }) {
  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl border-b border-white/5" />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #1D9E7540, #378ADD30, transparent)' }} />

      <div className="relative max-w-6xl mx-auto px-6 flex items-center h-16 gap-8">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 mr-4 cursor-pointer">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-[#1D9E75] rounded-lg blur-sm opacity-60" />
            <div className="relative w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L4 7v10l8 5 8-5V7z"/>
                <path d="M12 7v10M8 9.5l4 2.5 4-2.5"/>
              </svg>
            </div>
          </div>
          <span className="font-bold text-white tracking-tight">
            Nutri<span className="text-[#1D9E75]">Forge</span>
          </span>
        </motion.div>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              className="relative px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 group">

              {l.id === page && (
                <motion.div layoutId="nav-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #1D9E7525, #1D9E7510)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                  <div className="absolute top-0 left-2 right-2 h-px rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #1D9E7580, transparent)' }} />
                </motion.div>
              )}

              <span className={`relative flex items-center gap-2 transition-colors ${l.id === page ? 'text-[#1D9E75]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                {l.icon}
                {l.label}
              </span>
            </button>
          ))}
        </div>

        {/* User section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-white">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[#1D9E75] rounded-full blur-sm opacity-40" />
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#178A63] flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all">
            Sign out
          </motion.button>
        </div>
      </div>
    </nav>
  )
}