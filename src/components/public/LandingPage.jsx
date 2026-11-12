import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import ThemeToggle from '../ThemeToggle.jsx'
import BookingFlow from './BookingFlow.jsx'

export default function LandingPage({ onLoginClick }) {
  const { db } = useApp()
  const shop = db.shops['berber-ramazan']
  const [booking, setBooking] = useState(false)

  if (booking) return <BookingFlow shop={shop} onBack={() => setBooking(false)} />

  const hour = new Date().getHours()
  const isOpen = hour >= 9 && hour < 21

  return (
    <div className="min-h-screen">
      <div className="relative h-64 sm:h-80">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute top-4 inset-x-4 flex items-center justify-between">
          <span className={`badge backdrop-blur ${isOpen ? 'bg-emerald-500/90 text-white' : 'bg-gray-700/80 text-white'}`}>
            {isOpen ? '🟢 Şu an açık' : '⚪ Şu an kapalı'}
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={onLoginClick} className="bg-white/95 hover:bg-white text-gray-800 text-sm font-semibold rounded-xl px-3.5 py-2 shadow-lg transition-transform hover:-translate-y-0.5">
              İşletme Girişi
            </button>
          </div>
        </div>
        <div className="absolute bottom-5 left-4 right-4 text-white animate-slideUp">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2 drop-shadow-lg">
            <span className="animate-float inline-block">{shop.logoEmoji}</span> {shop.name}
          </h1>
          <p className="text-sm sm:text-base text-white/85 mt-1">{shop.slogan}</p>
          <div className="flex items-center gap-1 mt-2 text-amber-300 text-sm">
            ★★★★★ <span className="text-white/70 ml-1">4.9 (128 değerlendirme)</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 -mt-8 relative z-10">
        <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
          <div className="text-sm space-y-1.5 text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">📍 {shop.address}</p>
            <p className="flex items-center gap-2">🕒 {shop.workHours}</p>
            <p className="flex items-center gap-2">📞 {shop.phone.replace('90', '0')}</p>
          </div>
          <button onClick={() => setBooking(true)} className="btn-primary !py-3 shrink-0">📅 Randevu Al</button>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">✂️ Hizmetlerimiz</h2>
            <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">{shop.services.filter(s => s.active).length} hizmet</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {shop.services.filter(s => s.active).map((s, i) => (
              <div key={s.id} className="card flex gap-3 group cursor-pointer" style={{ animationDelay: `${i * 60}ms` }} onClick={() => setBooking(true)}>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{s.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-brand-600">{s.price}₺</span>
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500">⏱ {s.duration} dk</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '120ms' }}>
          <h2 className="section-title mb-3">🧑‍🔧 Ustalarımız</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {shop.staff.map(p => (
              <div key={p.id} className="card !p-4 text-center shrink-0 w-32 hover:-translate-y-1">
                <div className="text-4xl mb-1">{p.avatar}</div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{p.specialties.length} uzmanlık</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setBooking(true)} className="btn-primary w-full !py-4 text-base animate-slideUp" style={{ animationDelay: '180ms' }}>
          📅 Hemen Randevu Al
        </button>

        <p className="text-center text-xs text-gray-300 dark:text-gray-600 pb-4">Bu demo bir frontend uygulamasıdır · veriler tarayıcınızda saklanır</p>
      </div>
    </div>
  )
}
