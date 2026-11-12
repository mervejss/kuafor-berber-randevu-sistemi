import React, { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { toISODate, formatTR, startOfWeek } from '../../utils/date.js'

export default function Finance() {
  const { shop, addTransaction, addCredit, payCredit, addStaffAdvance } = useApp()
  const [range, setRange] = useState('gun') // gun | hafta | ay
  const [modal, setModal] = useState(null) // 'giris' | 'cikis' | 'veresiye' | 'avans'

  const todayISO = toISODate(new Date())
  const weekStart = startOfWeek(todayISO)
  const monthStart = todayISO.slice(0, 7)

  const inRange = (d) => {
    if (range === 'gun') return d === todayISO
    if (range === 'hafta') return d >= weekStart
    return d.startsWith(monthStart)
  }

  const txs = shop.transactions.filter(t => inRange(t.date))
  const income = txs.filter(t => t.type === 'giris').reduce((s, t) => s + t.amount, 0)
  const expense = txs.filter(t => t.type === 'cikis').reduce((s, t) => s + t.amount, 0)
  const cashIncome = txs.filter(t => t.type === 'giris' && t.method === 'nakit').reduce((s, t) => s + t.amount, 0)
  const cardIncome = txs.filter(t => t.type === 'giris' && t.method === 'kart').reduce((s, t) => s + t.amount, 0)

  const unpaidCredits = shop.credits.filter(c => !c.paid)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold">Kasa ve Finans</h1>
        <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          {['gun', 'hafta', 'ay'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${range === r ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-400'}`}>
              {r === 'gun' ? 'Gün' : r === 'hafta' ? 'Hafta' : 'Ay'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card !bg-emerald-50 dark:!bg-emerald-900/30 !border-0"><p className="text-xs text-gray-500">Kasaya Giren</p><p className="text-xl font-bold text-emerald-600">{income}₺</p><p className="text-xs text-gray-400">Nakit {cashIncome}₺ · Kart {cardIncome}₺</p></div>
        <div className="card !bg-rose-50 dark:!bg-rose-900/30 !border-0"><p className="text-xs text-gray-500">Kasadan Çıkan</p><p className="text-xl font-bold text-rose-600">{expense}₺</p></div>
        <div className="card !bg-brand-50 dark:!bg-brand-900/30 !border-0 col-span-2"><p className="text-xs text-gray-500">Ciro (Net Kalan)</p><p className="text-2xl font-bold text-brand-700 dark:text-brand-300">{income - expense}₺</p></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setModal('giris')} className="btn-success">+ Para Girdi</button>
        <button onClick={() => setModal('cikis')} className="btn-danger">+ Para Çıktı</button>
        <button onClick={() => setModal('veresiye')} className="btn-secondary">📒 Veresiye Ekle</button>
        <button onClick={() => setModal('avans')} className="btn-secondary">🧑‍🔧 Personel Avansı</button>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">📒 Veresiye Defteri ({unpaidCredits.length} kişi borçlu)</h2>
        {unpaidCredits.length === 0 && <p className="text-sm text-gray-400">Borçlu müşteri yok.</p>}
        <div className="space-y-2">
          {unpaidCredits.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2">
              <div><p className="font-medium text-sm">{c.customerName}</p><p className="text-xs text-gray-400">{formatTR(c.date)} · {c.amount}₺</p></div>
              <button onClick={() => payCredit(c.id)} className="btn-success !py-1.5 !px-3 text-xs">Ödeme Al</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">🧑‍🔧 Personel Avans/Ödemeleri</h2>
        {shop.staffAdvances.length === 0 && <p className="text-sm text-gray-400">Kayıt yok.</p>}
        <div className="space-y-2">
          {shop.staffAdvances.map(a => {
            const staff = shop.staff.find(p => p.id === a.staffId)
            return (
              <div key={a.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <p className="text-sm">{staff?.name} - {a.note}</p>
                <p className="font-semibold text-sm">{a.amount}₺</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Son İşlemler</h2>
        <div className="space-y-2 max-h-72 overflow-auto">
          {[...shop.transactions].reverse().map(t => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <span className="truncate pr-2">{t.desc}</span>
              <span className={`font-semibold shrink-0 ${t.type === 'giris' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'giris' ? '+' : '-'}{t.amount}₺</span>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <FinanceModal type={modal} shop={shop} onClose={() => setModal(null)}
          onSubmit={(data) => {
            if (modal === 'giris') addTransaction({ type: 'giris', ...data })
            if (modal === 'cikis') addTransaction({ type: 'cikis', ...data })
            if (modal === 'veresiye') addCredit(data)
            if (modal === 'avans') addStaffAdvance(data)
            setModal(null)
          }} />
      )}
    </div>
  )
}

function FinanceModal({ type, shop, onClose, onSubmit }) {
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [method, setMethod] = useState('nakit')
  const [customerName, setCustomerName] = useState('')
  const [staffId, setStaffId] = useState(shop.staff[0]?.id || '')
  const today = toISODate(new Date())

  const titles = { giris: 'Para Girdi Ekle', cikis: 'Para Çıktı Ekle', veresiye: 'Veresiye Ekle', avans: 'Personel Avansı Ekle' }

  const submit = () => {
    if (!amount) return
    if (type === 'giris' || type === 'cikis') onSubmit({ amount: Number(amount), desc: desc || (type === 'giris' ? 'Elden gelen ödeme' : 'Masraf'), method, date: today })
    if (type === 'veresiye') onSubmit({ customerName, phone: '905000000000', amount: Number(amount), date: today })
    if (type === 'avans') onSubmit({ staffId, amount: Number(amount), date: today, note: desc || 'Avans' })
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-5 space-y-3" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{titles[type]}</h2>
        {(type === 'veresiye') && <input className="input" placeholder="Müşteri adı" value={customerName} onChange={e => setCustomerName(e.target.value)} />}
        {type === 'avans' && (
          <select className="input" value={staffId} onChange={e => setStaffId(e.target.value)}>
            {shop.staff.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
        <input className="input" type="number" placeholder="Tutar (₺)" value={amount} onChange={e => setAmount(e.target.value)} />
        {(type === 'giris' || type === 'cikis') && (
          <>
            <input className="input" placeholder="Açıklama" value={desc} onChange={e => setDesc(e.target.value)} />
            <select className="input" value={method} onChange={e => setMethod(e.target.value)}>
              <option value="nakit">Nakit</option>
              <option value="kart">Kart</option>
            </select>
          </>
        )}
        {type === 'avans' && <input className="input" placeholder="Not (opsiyonel)" value={desc} onChange={e => setDesc(e.target.value)} />}
        <div className="flex gap-2 pt-1">
          <button className="btn-secondary flex-1" onClick={onClose}>Vazgeç</button>
          <button className="btn-primary flex-1" onClick={submit}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}
