import React, { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

const STYLES = {
  success: { icon: '✅', bar: 'bg-emerald-500' },
  info: { icon: '💬', bar: 'bg-brand-500' },
  error: { icon: '⚠️', bar: 'bg-rose-500' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])

  const api = {
    success: (m) => push(m, 'success'),
    info: (m) => push(m, 'info'),
    error: (m) => push(m, 'error'),
  }

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed top-4 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto animate-slideUp max-w-sm w-full sm:w-auto bg-white dark:bg-gray-900 shadow-soft rounded-2xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 overflow-hidden relative">
            <span className={`absolute left-0 top-0 bottom-0 w-1 ${STYLES[t.type].bar}`} />
            <span className="text-lg">{STYLES[t.type].icon}</span>
            <p className="text-sm font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
