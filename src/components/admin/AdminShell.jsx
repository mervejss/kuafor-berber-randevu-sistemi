import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import ThemeToggle from '../ThemeToggle.jsx'
import Dashboard from './Dashboard.jsx'
import CalendarView from './CalendarView.jsx'
import Finance from './Finance.jsx'
import StaffManager from './StaffManager.jsx'
import ServiceManager from './ServiceManager.jsx'
import VoiceAssistant from './VoiceAssistant.jsx'

const TABS = [
  { key: 'dashboard', label: 'Özet', icon: '🏠' },
  { key: 'calendar', label: 'Takvim', icon: '📅' },
  { key: 'finance', label: 'Kasa', icon: '💰' },
  { key: 'staff', label: 'Personel', icon: '👥' },
  { key: 'services', label: 'Hizmetler', icon: '✂️' },
]

export default function AdminShell({ onExit }) {
  const { shop, logout } = useApp()
  const [tab, setTab] = useState('dashboard')
  const [voiceOpen, setVoiceOpen] = useState(false)

  if (!shop) return null

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard goTo={setTab} />
      case 'calendar': return <CalendarView />
      case 'finance': return <Finance />
      case 'staff': return <StaffManager />
      case 'services': return <ServiceManager />
      default: return null
    }
  }

  return (
    <div className="min-h-screen pb-24 md:pb-6 md:flex">
      {/* Desktop side nav */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <span className="text-3xl bg-brand-50 dark:bg-brand-900/30 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">{shop.logoEmoji}</span>
          <div className="min-w-0">
            <p className="font-display font-bold leading-tight truncate">{shop.name}</p>
            <p className="text-xs text-gray-400">Yönetim Paneli</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${tab === t.key ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white nav-active-indicator' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
              <span className="text-lg">{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-xs font-semibold text-gray-400">Tema</span>
          <ThemeToggle />
        </div>
        <button onClick={() => setVoiceOpen(true)} className="btn-danger w-full mb-2 shadow-glowRose">🎙️ Sesli Komut</button>
        <button onClick={onExit} className="btn-secondary w-full mb-2 text-xs">🌐 Vitrini Görüntüle</button>
        <button onClick={logout} className="btn-ghost w-full">Çıkış Yap</button>
      </aside>

      <div className="flex-1 md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl bg-brand-50 dark:bg-brand-900/30 w-10 h-10 rounded-xl flex items-center justify-center">{shop.logoEmoji}</span>
            <p className="font-display font-bold">{shop.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="btn-ghost !px-2.5 !py-1.5 text-xs">Çıkış</button>
          </div>
        </header>

        <main className="p-4 max-w-5xl mx-auto animate-fadeIn" key={tab}>
          {renderTab()}
        </main>
      </div>

      {/* Mobile floating mic button */}
      <button onClick={() => setVoiceOpen(true)}
        className="md:hidden fixed bottom-24 right-4 z-30 w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white text-2xl shadow-glowRose flex items-center justify-center active:scale-90 transition-transform animate-float">
        🎙️
      </button>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-100 dark:border-gray-800 flex justify-around px-1 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl text-[11px] font-semibold transition-all duration-200 ${tab === t.key ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/30 -translate-y-0.5' : 'text-gray-400'}`}>
            <span className="text-lg">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {voiceOpen && <VoiceAssistant onClose={() => setVoiceOpen(false)} />}
    </div>
  )
}
