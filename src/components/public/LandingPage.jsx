import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import BookingFlow from './BookingFlow.jsx'

export default function LandingPage({ onLoginClick }) {
  const { db } = useApp()
  const shop = db.shops['berber-ramazan']
  const [booking, setBooking] = useState(false)

  if (booking) return <BookingFlow shop={shop} onBack={() => setBooking(false)} />

  return (
    <div className="min-h-screen">
      <div className="relative h-56 sm:h-72">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <button onClick={onLoginClick} className="absolute top-4 right-4 bg-white/90 text-gray-800 text-sm font-medium rounded-xl px-3 py-1.5">İşletme Girişi</button>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">{shop.logoEmoji} {shop.name}</h1>
          <p className="text-sm text-white/80">{shop.slogan}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-5 -mt-6 relative">
        <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm space-y-1">
            <p>📍 {shop.address}</p>
            <p>🕒 {shop.workHours}</p>
            <p>📞 {shop.phone.replace('90', '0')}</p>
          </div>
          <button onClick={() => setBooking(true)} className="btn-primary">Randevu Al</button>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Hizmetlerimiz</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {shop.services.filter(s => s.active).map(s => (
              <div key={s.id} className="card flex gap-3">
                <img src={s.image} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{s.desc}</p>
                  <p className="text-sm font-bold text-brand-600 mt-1">{s.price}₺ · {s.duration} dk</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Ustalarımız</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {shop.staff.map(p => (
              <div key={p.id} className="card !p-3 text-center shrink-0 w-28">
                <div className="text-3xl">{p.avatar}</div>
                <p className="text-sm font-medium mt-1">{p.name}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setBooking(true)} className="btn-primary w-full">📅 Hemen Randevu Al</button>
      </div>
    </div>
  )
}
