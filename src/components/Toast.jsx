import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="absolute top-3 right-3 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onDone={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800)
    const removeTimer = setTimeout(onDone, 2100)
    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [onDone])

  const Icon = toast.type === 'success' ? CheckCircle : XCircle
  const bg = toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div
      className={`${bg} text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <Icon size={14} />
      {toast.message}
    </div>
  )
}
