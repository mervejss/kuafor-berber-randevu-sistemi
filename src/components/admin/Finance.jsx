import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { toISODate, formatTR, startOfWeek } from '../../utils/date.js'

export default function Finance() {
  const { shop, addTransaction, addCredit, payCredit, addStaffAdvance } = useApp()
  const toast = useToast()
  const [range, setRange] = useState('gun')
  const [modal, setModal] = useState(null)

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
  const total = Math.max(income + expense, 1)

  const unpaidCredits = shop.credits.filter(c => !c.paid)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3 animate-slideUp">
        <h1 className="font-display text-2xl font-bold tracking-tight">💰 Kasa ve Finans</h1>
        <div className="flex rounded-2xl bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
          {['gun', 'hafta', 'ay'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${range === r ? 'bg-white dark:bg-gray-900 shadow-md text-brand-600' : 'text-gray-400'}`}>
              {r === 'gun' ? 'Gün' : r === 'hafta' ? 'Hafta' : 'Ay'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 animate-slideUp" style={{ animationDelay: '40ms' }}>
        <div className="card !bg-gradient-to-br !from-emerald-50 !to-emerald-100/50 dark:!from-emerald-900/30 dark:!to-emerald-900/10 !border-0">
          <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 font-semibold">💵 Kasaya Giren</p>
          <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">{income}₺</p>
          <p className="text-xs text-emerald-700/50 dark:text-emerald-300/50 mt-1">Nakit {cashIncome}₺ · Kart {cardIncome}₺</p>
        </div>
        <div className="card !bg-gradient-to-br !from-rose-50 !to-rose-100/50 dark:!from-rose-900/30 dark:!to-rose-900/10 !border-0">
          <p className="text-xs text-rose-700/70 dark:text-rose-300/70 font-semibold">📤 Kasadan Çıkan</p>
          <p className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400 mt-1">{expense}₺</p>
        </div>
        <div className="card !bg-gradient-to-br !from-brand-500 !to-brand-700 !border-0 col-span-2 text-white shadow-glow">
          <p className="text-xs text-brand-100 font-semibold">💼 Ciro (Net Kalan)</p>
          <p className="text-3xl font-bold font-display mt-1">{income - expense}₺</p>
          <div className="w-full h-2 bg-white/20 rounded-full mt-3 overflow-hidden flex">
            <div className="h-full bg-emerald-300 transition-all duration-500" style={{ width: `${(income / total) * 100}%` }} />
            <div className="h-full bg-rose-300 transition-all duration-500" style={{ width: `${(expense / total) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 animate-slideUp" style={{ animationDelay: '80ms' }}>
        <button onClick={() => setModal('giris')} className="btn-success !py-3">+ Para Girdi</button>
        <button onClick={() => setModal('cikis')} className="btn-danger !py-3">+ Para Çıktı</button>
        <button onClick={() => setModal('veresiye')} className="btn-secondary !py-3">📒 Veresiye Ekle</button>
        <button onClick={() => setModal('avans')} className="btn-secondary !py-3">🧑‍🔧 Personel Avansı</button>
      </div>

      <div className="card animate-slideUp" style={{ animationDelay: '120ms' }}>
        <h2 className="font-display font-bold mb-3 flex items-center gap-1.5">📒 Veresiye Defteri <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{unpaidCredits.length} kişi</span></h2>
        {unpaidCredits.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">✨ Borçlu müşteri yok.</p>}
        <div className="space-y-2">
          {unpaidCredits.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-3.5 py-2.5">
              <div><p className="font-semibold text-sm">{c.customerName}</p><p className="text-xs text-gray-400">{formatTR(c.date)} · {c.amount}₺</p></div>
              <button onClick={() => { payCredit(c.id); toast.success(`${c.customerName} - ödeme alındı`) }} className="btn-success !py-1.5 !px-3.5 text-xs">Ödeme Al</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card animate-slideUp" style={{ animationDelay: '160ms' }}>
        <h2 className="font-display font-bold mb-3">🧑‍🔧 Personel Avans/Ödemeleri</h2>
        {shop.staffAdvances.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">Kayıt yok.</p>}
        <div className="space-y-2">
          {shop.staffAdvances.map(a => {
            const staff = shop.staff.find(p => p.id === a.staffId)
            return (
              <div key={a.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/70 rounded-2xl px-3.5 py-2.5">
                <p className="text-sm font-medium">{staff?.avatar} {staff?.name} - {a.note}</p>
                <p className="font-bold text-sm">{a.amount}₺</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card animate-slideUp" style={{ animationDelay: '200ms' }}>
        <h2 className="font-display font-bold mb-3">🧾 Son İşlemler</h2>
        <div className="space-y-2.5 max-h-72 overflow-auto">
          {[...shop.transactions].reverse().map(t => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <span className="truncate pr-2 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${t.type === 'giris' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {t.desc}
              </span>
              <span className={`font-bold shrink-0 ${t.type === 'giris' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'giris' ? '+' : '-'}{t.amount}₺</span>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <FinanceModal type={modal} shop={shop} onClose={() => setModal(null)}
          onSubmit={(data) => {
            if (modal === 'giris') { addTransaction({ type: 'giris', ...data }); toast.success('Kasaya giriş eklendi') }
            if (modal === 'cikis') { addTransaction({ type: 'cikis', ...data }); toast.info('Kasa çıkışı eklendi') }
            if (modal === 'veresiye') { addCredit(data); toast.info('Veresiye defterine eklendi') }
            if (modal === 'avans') { addStaffAdvance(data); toast.success('Personel avansı kaydedildi') }
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

  const titles = { giris: '💵 Para Girdi Ekle', cikis: '📤 Para Çıktı Ekle', veresiye: '📒 Veresiye Ekle', avans: '🧑‍🔧 Personel Avansı Ekle' }

  const submit = () => {
    if (!amount) return
    if (type === 'giris' || type === 'cikis') onSubmit({ amount: Number(amount), desc: desc || (type === 'giris' ? 'Elden gelen ödeme' : 'Masraf'), method, date: today })
    if (type === 'veresiye') onSubmit({ customerName, phone: '905000000000', amount: Number(amount), date: today })
    if (type === 'avans') onSubmit({ staffId, amount: Number(amount), date: today, note: desc || 'Avans' })
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-6 space-y-3.5 animate-slideUp sm:animate-scaleIn" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-lg font-bold">{titles[type]}</h2>
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
            <div className="flex gap-2">
              {['nakit', 'kart'].map(m => (
                <button key={m} onClick={() => setMethod(m)} className={`chip flex-1 justify-center ${method === m ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-gray-700'}`}>
                  {m === 'nakit' ? '💵 Nakit' : '💳 Kart'}
                </button>
              ))}
            </div>
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
