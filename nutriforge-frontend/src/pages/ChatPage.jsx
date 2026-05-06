import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

const suggestions = [
  "What should I eat before a workout?",
  "How much protein do I need daily?",
  "Best exercises for building a wider back?",
  "How do I break through a weight loss plateau?",
  "Should I do cardio before or after weights?",
  "What supplements are worth taking?",
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${isUser ? 'bg-[#1D9E75]/20 border border-[#1D9E75]/30' : 'bg-[#378ADD]/20 border border-[#378ADD]/30'}`}>
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L4 7v10l8 5 8-5V7z"/><path d="M12 7v10M8 9.5l4 2.5 4-2.5"/>
          </svg>
        )}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 ${isUser ? 'rounded-tr-sm border border-[#1D9E75]/20' : 'rounded-tl-sm border border-white/8'}`}
        style={{ background: isUser ? 'linear-gradient(135deg, #1D9E7520, #1D9E7510)' : 'linear-gradient(135deg, #ffffff08, #ffffff04)' }}>
        {isUser ? (
          <p className="text-sm text-white leading-relaxed">{msg.content}</p>
        ) : (
          <div className="text-sm text-gray-200 leading-relaxed prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#378ADD]/20 border border-[#378ADD]/30">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2L4 7v10l8 5 8-5V7z"/><path d="M12 7v10M8 9.5l4 2.5 4-2.5"/>
        </svg>
      </div>
      <div className="rounded-2xl rounded-tl-sm px-5 py-4 border border-white/8"
        style={{ background: 'linear-gradient(135deg, #ffffff08, #ffffff04)' }}>
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#378ADD]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am your NutriForge AI fitness assistant. I can help you with nutrition planning, workout advice, supplement recommendations, and anything else fitness-related. What would you like to know?"
    }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('nf_token')
    if (token) {
      fetch('http://127.0.0.1:8000/api/users/profile', {
        headers: { Authorization: 'Bearer ' + token }
      }).then(r => r.json()).then(setProfile).catch(() => {})
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')

    const profileContext = profile
      ? profile.gender + ', ' + profile.age + ' years old, ' + profile.weight_kg + 'kg, goal: ' + (profile.goal || '').replace(/_/g, ' ')
      : ''

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const token = localStorage.getItem('nf_token')
      const response = await fetch('http://127.0.0.1:8000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          profile_context: profileContext,
        })
      })

      const data = await response.json()
      const reply = data.reply || 'Sorry, I could not generate a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.'
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-8rem)]">

      <div className="relative mb-6">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#378ADD]/8 rounded-full blur-3xl pointer-events-none" />
        <p className="text-[#378ADD] text-xs font-semibold tracking-widest uppercase mb-2">AI powered</p>
        <h1 className="text-4xl font-bold text-white">Fitness Assistant</h1>
        <p className="text-gray-500 mt-2">Ask me anything about nutrition, training, or supplements</p>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden border border-white/8 rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #ffffff04 0%, #ffffff02 100%)' }}>

        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #378ADD30, transparent)' }} />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && <TypingIndicator />}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Suggested questions</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <motion.button key={i}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-[#378ADD]/40 transition-all"
                  style={{ background: '#ffffff06' }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#378ADD]/40 transition-all placeholder-gray-600 resize-none"
                placeholder="Ask anything about fitness, nutrition, or training..."
                value={input}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #378ADD, #2563EB)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
              </svg>
            </motion.button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </motion.div>
  )
}