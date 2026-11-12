import React, { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { toISODate, formatTR, addDaysISO } from '../../utils/date.js'

export default function Dashboard({ goTo }) {
  const { shop } = useApp()
  const [query, setQuery] = useState('')
  const todayISO = toISODate(new Date())

  const todayAppointments = shop.appointments.filter(a => a.date === todayISO && a.status !== 'iptal')
  const todayIncome = shop.transactions.filter(t => t.date === todayISO && t.type === 'giris').reduce((s, t) => s + t.amount, 0)
  const todayExpense = shop.transactions.filter(t => t.date === todayISO && t.type === 'cikis').reduce((s, t) => s + t.amount, 0)
  const pendingCredits = shop.credits.filter(c => !c.paid).reduce((s, c) => s + c.amount, 0)

  const last7 = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDaysISO(todayISO, i - 6))
    return days.map(d => ({
      date: d,
      total: shop.transactions.filter(t => t.date === d && t.type === 'giris').reduce((s, t) => s + t.amount, 0)
    }))
  }, [shop, todayISO])
  const maxVal = Math.max(...last7.map(d => d.total), 1)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const apts = shop.appointments.filter(a => a.customerName.toLowerCase().includes(q))
    const txs = shop.transactions.filter(t => t.desc.toLowerCase().includes(q))
    return [...apts.map(a => ({ kind: 'Randevu', label: `${a.customerName} - ${formatTR(a.date)} ${a.time}` })),
      ...txs.map(t => ({ kind: 'İşlem', label: `${t.desc} (${t.amount}₺)` }))]
  }, [query, shop])

  return (
    <div className="space-y-5">
      <div className="animate-slideUp">
        <h1 className="font-display text-2xl font-bold tracking-tight">Hoş geldin, {shop.name} 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">{formatTR(todayISO)} özeti</p>
      </div>

      <div className="relative animate-slideUp" style={{ animationDelay: '40ms' }}>
        <input className="input !pl-10 !py-3" placeholder="Müşteri veya işlem ara..." value={query} onChange={e => setQuery(e.target.value)} />
        <span className="absolute left-3.5 top-3.5">🔍</span>
        {results.length > 0 && (
          <div className="absolute z-10 mt-1.5 w-full card !p-2 space-y-1 max-h-60 overflow-auto animate-scaleIn origin-top">
            {results.map((r, i) => (
              <div key={i} className="px-2.5 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex justify-between items-center">
                <span>{r.label}</span><span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500">{r.kind}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 animate-slideUp" style={{ animationDelay: '80ms' }}>
        <StatCard title="Bugünkü Randevu" value={todayAppointments.length} icon="📅" color="brand" onClick={() => goTo('calendar')} />
        <StatCard title="Bugün Kasaya Giren" value={`${todayIncome}₺`} icon="💵" color="emerald" onClick={() => goTo('finance')} />
        <StatCard title="Bugün Çıkan" value={`${todayExpense}₺`} icon="📤" color="rose" onClick={() => goTo('finance')} />
        <StatCard title="Veresiye Alacak" value={`${pendingCredits}₺`} icon="📒" color="amber" onClick={() => goTo('finance')} />
      </div>

      <div className="card animate-slideUp" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold">📈 Son 7 Gün Kasaya Giren</h2>
          <span className="text-xs text-gray-400">günlük nakit+kart</span>
        </div>
        <div className="flex items-end gap-2 h-28">
          {last7.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.total}₺</span>
              <div className="w-full bg-gradient-to-t from-brand-500 to-brand-300 rounded-lg transition-all duration-500 hover:from-brand-600 hover:to-brand-400"
                style={{ height: `${Math.max((d.total / maxVal) * 100, 4)}%` }} />
              <span className="text-[10px] text-gray-400">{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card animate-slideUp" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold">🗓️ Bugünün Randevuları</h2>
          <button onClick={() => goTo('calendar')} className="text-sm text-brand-600 font-semibold hover:underline">Tümü →</button>
        </div>
        {todayAppointments.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">✨ Bugün için randevu yok.</p>}
        <div className="space-y-2">
          {todayAppointments.slice(0, 5).map(a => {
            const staff = shop.staff.find(p => p.id === a.staffId)
            const service = shop.services.find(s => s.id === a.serviceId)
            return (
              <div key={a.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/70 rounded-2xl px-3.5 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-lg shadow-sm">{staff?.avatar || '👤'}</span>
                  <div>
                    <p className="font-semibold text-sm">{a.time} · {a.customerName}</p>
                    <p className="text-xs text-gray-400">{service?.name} · {staff?.name}</p>
                  </div>
                </div>
                <span className={`badge ${a.status === 'onaylandi' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                  {a.status === 'onaylandi' ? 'Onaylı' : 'Bekliyor'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color = 'brand', onClick }) {
  const colors = {
    brand: 'from-brand-500 to-brand-700 shadow-brand-500/30',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30',
    rose: 'from-rose-400 to-rose-600 shadow-rose-500/30',
    amber: 'from-amber-400 to-amber-600 shadow-amber-500/30',
  }
  return (
    <button onClick={onClick} className="card text-left hover:-translate-y-1 group">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-xs text-gray-400 font-medium">{title}</p>
      <p className="text-xl font-bold font-display mt-0.5">{value}</p>
    </button>
  )
}
