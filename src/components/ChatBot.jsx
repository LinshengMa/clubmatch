import { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { chatWithAssistant } from '../services/aiService'
import { clubs } from '../data/mockData'
import { useTypewriter } from '../hooks/useTypewriter'

const QUICK_QUESTIONS = [
  '有哪些技术类社团？',
  '时间少加什么社团好？',
  '零基础能加入吗？',
  '想参加比赛拿奖',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  // Draggable FAB state
  const [fabPos, setFabPos] = useState({ x: 0, y: 0 }) // offset from default position
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragMoved = useRef(false)
  const fabRef = useRef(null)

  const clampToContainer = (x, y) => {
    const container = fabRef.current?.closest('[style*="maxWidth"]')
    if (!container) return { x, y }
    const cr = container.getBoundingClientRect()
    const fabSize = 48 // w-12 = 48px
    // Default position is bottom-5(20px) right-4(16px), offset is relative to that
    const defaultRight = 16
    const defaultBottom = 20
    // Calculate bounds for the offset
    const minX = -(cr.width - defaultRight - fabSize)
    const maxX = defaultRight
    const minY = -(cr.height - defaultBottom - fabSize)
    const maxY = defaultBottom
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    }
  }

  const handleFabPointerDown = (e) => {
    setDragging(true)
    dragMoved.current = false
    dragStart.current = { x: e.clientX - fabPos.x, y: e.clientY - fabPos.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const handleFabPointerMove = (e) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx - fabPos.x) > 3 || Math.abs(dy - fabPos.y) > 3) {
      dragMoved.current = true
    }
    setFabPos(clampToContainer(dx, dy))
  }
  const handleFabPointerUp = () => {
    setDragging(false)
    if (!dragMoved.current) {
      setOpen(true)
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const reply = await chatWithAssistant(newMessages, clubs)
    setMessages([...newMessages, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  if (!open) {
    return (
      <div
        ref={fabRef}
        onPointerDown={handleFabPointerDown}
        onPointerMove={handleFabPointerMove}
        onPointerUp={handleFabPointerUp}
        className="absolute bottom-5 right-4 z-40 w-12 h-12 rounded-full bg-indigo-500 text-white text-xl shadow-lg flex items-center justify-center touch-none select-none"
        style={{
          transform: `translate(${fabPos.x}px, ${fabPos.y}px)`,
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'box-shadow 0.2s',
        }}
      >
        🎯
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 right-0 left-0 top-0 z-40 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />

      {/* Chat window */}
      <div className="absolute bottom-3 right-3 left-3 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: 480 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-bold text-gray-800">小Match AI助手</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-400 text-center mb-2">
                👋 你好！我是小Match，有什么关于社团的问题都可以问我～
              </p>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs text-left px-3 py-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              msg={msg}
              isLast={i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <span className="text-sm">🎯</span>
              <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-500">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="输入你的问题..."
              className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg, isLast }) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-indigo-500 text-white rounded-xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap">
          {msg.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <span className="text-sm shrink-0">🎯</span>
      <AIBubble text={msg.content} animate={isLast} />
    </div>
  )
}

function AIBubble({ text, animate }) {
  const { displayed } = useTypewriter(text, 15, animate)

  return (
    <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 max-w-[85%] whitespace-pre-wrap">
      {displayed}
    </div>
  )
}
