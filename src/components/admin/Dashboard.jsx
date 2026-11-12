import React, { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { toISODate, formatTR } from '../../utils/date.js'

export default function Dashboard({ goTo }) {
  const { shop } = useApp()
  const [query, setQuery] = useState('')
  const todayISO = toISODate(new Date())

  const todayAppointments = shop.appointments.filter(a => a.date === todayISO && a.status !== 'iptal')
  const todayIncome = shop.transactions.filter(t => t.date === todayISO && t.type === 'giris').reduce((s, t) => s + t.amount, 0)
  const todayExpense = shop.transactions.filter(t => t.date === todayISO && t.type === 'cikis').reduce((s, t) => s + t.amount, 0)
  const pendingCredits = shop.credits.filter(c => !c.paid).reduce((s, c) => s + c.amount, 0)

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
      <div>
        <h1 className="text-xl font-bold">Hoş geldin, {shop.name} 👋</h1>
        <p className="text-sm text-gray-400">{formatTR(todayISO)} özeti</p>
      </div>

      <div className="relative">
        <input className="input pl-10" placeholder="Müşteri veya işlem ara..." value={query} onChange={e => setQuery(e.target.value)} />
        <span className="absolute left-3 top-2.5">🔍</span>
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full card !p-2 space-y-1 max-h-60 overflow-auto">
            {results.map((r, i) => (
              <div key={i} className="px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex justify-between">
                <span>{r.label}</span><span className="badge bg-gray-100 dark:bg-gray-800">{r.kind}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard title="Bugünkü Randevu" value={todayAppointments.length} icon="📅" onClick={() => goTo('calendar')} />
        <StatCard title="Bugün Kasaya Giren" value={`${todayIncome}₺`} icon="💵" color="emerald" onClick={() => goTo('finance')} />
        <StatCard title="Bugün Çıkan" value={`${todayExpense}₺`} icon="📤" color="rose" onClick={() => goTo('finance')} />
        <StatCard title="Veresiye Alacak" value={`${pendingCredits}₺`} icon="📒" color="amber" onClick={() => goTo('finance')} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Bugünün Randevuları</h2>
          <button onClick={() => goTo('calendar')} className="text-sm text-brand-600 font-medium">Tümü →</button>
        </div>
        {todayAppointments.length === 0 && <p className="text-sm text-gray-400">Bugün için randevu yok.</p>}
        <div className="space-y-2">
          {todayAppointments.slice(0, 5).map(a => {
            const staff = shop.staff.find(p => p.id === a.staffId)
            const service = shop.services.find(s => s.id === a.serviceId)
            return (
              <div key={a.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <div>
                  <p className="font-medium text-sm">{a.time} · {a.customerName}</p>
                  <p className="text-xs text-gray-400">{service?.name} · {staff?.name}</p>
                </div>
                <span className={`badge ${a.status === 'onaylandi' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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
    brand: 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  }
  return (
    <button onClick={onClick} className={`card text-left ${colors[color]} !border-0`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs opacity-70">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </button>
  )
}
