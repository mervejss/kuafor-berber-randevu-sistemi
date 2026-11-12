import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
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
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-3xl">{shop.logoEmoji}</span>
          <div>
            <p className="font-bold leading-tight">{shop.name}</p>
            <p className="text-xs text-gray-400">Yönetim Paneli</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${tab === t.key ? 'bg-brand-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setVoiceOpen(true)} className="btn-danger w-full mb-2">🎙️ Sesli Komut</button>
        <button onClick={onExit} className="btn-secondary w-full mb-2 text-xs">🌐 Vitrini Görüntüle</button>
        <button onClick={logout} className="btn-secondary w-full">Çıkış Yap</button>
      </aside>

      <div className="flex-1 md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{shop.logoEmoji}</span>
            <p className="font-bold">{shop.name}</p>
          </div>
          <button onClick={logout} className="text-sm text-gray-400">Çıkış</button>
        </header>

        <main className="p-4 max-w-5xl mx-auto">
          {renderTab()}
        </main>
      </div>

      {/* Mobile floating mic button */}
      <button onClick={() => setVoiceOpen(true)}
        className="md:hidden fixed bottom-24 right-4 z-30 w-16 h-16 rounded-full bg-rose-500 text-white text-2xl shadow-2xl shadow-rose-500/40 flex items-center justify-center active:scale-90 transition">
        🎙️
      </button>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around px-1 py-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[11px] font-medium ${tab === t.key ? 'text-brand-600' : 'text-gray-400'}`}>
            <span className="text-lg">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {voiceOpen && <VoiceAssistant onClose={() => setVoiceOpen(false)} />}
    </div>
  )
}
