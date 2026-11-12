import React, { useEffect, useState } from 'react'

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('kuafor_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('kuafor_theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      aria-label="Tema değiştir"
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${dark ? 'bg-brand-700' : 'bg-amber-200'} ${className}`}
    >
      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs transition-transform duration-300 ${dark ? 'translate-x-6' : 'translate-x-0'}`}>
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
