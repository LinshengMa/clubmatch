import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { generateIntro } from '../services/aiService'
import { useTypewriter } from '../hooks/useTypewriter'
import { useToast } from './Toast'

export default function ApplicationDrawer({ club, profile, onConfirm, onCancel }) {
  const [intro, setIntro] = useState('')
  const [loading, setLoading] = useState(true)
  const [editedIntro, setEditedIntro] = useState('')
  const showToast = useToast()
  const { displayed, done } = useTypewriter(intro, 18, loading === false)

  useEffect(() => {
    let cancelled = false
    generateIntro(profile || {}, club).then((text) => {
      if (cancelled) return
      setIntro(text)
      setEditedIntro(text)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [club, profile])

  // Sync typewriter output to editable textarea
  useEffect(() => {
    if (!done) setEditedIntro(displayed)
  }, [displayed, done])

  const handleConfirm = () => {
    onConfirm(editedIntro)
    showToast(`已成功报名 ${club.name}！`)
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* Drawer */}
      <div className="relative bg-white rounded-t-2xl p-5 max-h-[75%] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: club.coverColor }}
            >
              {club.avatar}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">{club.name}</h3>
              <p className="text-xs text-gray-400">{club.category}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* AI Intro */}
        <div className="mb-3">
          <p className="text-xs font-medium text-indigo-500 mb-2">
            ✨ AI 为你生成的自我介绍草稿
          </p>
          {loading ? (
            <div className="h-24 bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-xs text-gray-400 animate-pulse">AI 生成中...</span>
            </div>
          ) : (
            <textarea
              value={editedIntro}
              onChange={(e) => setEditedIntro(e.target.value)}
              className="w-full h-28 p-3 text-sm text-gray-700 bg-gray-50 rounded-xl border border-gray-100 resize-none focus:outline-none focus:border-indigo-300"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            再想想
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            确认报名
          </button>
        </div>
      </div>
    </div>
  )
}
