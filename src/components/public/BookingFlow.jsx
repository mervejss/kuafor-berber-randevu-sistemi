import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { toISODate, addDaysISO, formatTR, timeSlots, DOW_SHORT, fromISODate } from '../../utils/date.js'

const STEPS = [
  { label: 'Hizmet', icon: '✂️' },
  { label: 'Usta', icon: '🧑‍🔧' },
  { label: 'Zaman', icon: '🕒' },
  { label: 'Bilgiler', icon: '📝' },
  { label: 'Onay', icon: '✅' },
]

export default function BookingFlow({ shop, onBack }) {
  const { publicBook } = useApp()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(null)
  const [staffId, setStaffId] = useState(null)
  const [date, setDate] = useState(toISODate(new Date()))
  const [time, setTime] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)

  const service = shop.services.find(s => s.id === serviceId)
  const staff = shop.staff.find(p => p.id === staffId)
  const eligibleStaff = shop.staff.filter(p => p.specialties.includes(serviceId))

  const dayOptions = Array.from({ length: 7 }, (_, i) => addDaysISO(toISODate(new Date()), i))
  const takenTimes = new Set(shop.appointments.filter(a => a.date === date && a.staffId === staffId && a.status !== 'iptal').map(a => a.time))
  const blockedTimes = new Set(shop.blockedSlots.filter(b => b.date === date && b.staffId === staffId).map(b => b.time))

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const back = () => step === 0 ? onBack() : setStep(s => s - 1)

  const confirm = () => {
    publicBook(shop.id, { date, time, serviceId, staffId, customerName: name, phone })
    toast.success('Randevunuz işletmeye iletildi!')
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gradient-to-br from-brand-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="card max-w-sm animate-popIn">
          <div className="text-6xl mb-3 animate-popIn">✅</div>
          <h2 className="font-display text-xl font-bold mb-2">Randevunuz Alındı!</h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            <b>{formatTR(date)}</b> saat <b>{time}</b> için <b>{service?.name}</b> randevunuz, <b>{staff?.name}</b> ile oluşturuldu.
            İşletme onayınızı WhatsApp üzerinden iletecektir.
          </p>
          <button onClick={onBack} className="btn-primary w-full">Ana Sayfaya Dön</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-6 sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur py-2 z-10">
        <button onClick={back} className="btn-secondary btn-icon">←</button>
        <div className="flex-1 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-brand-400 to-brand-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 animate-slideUp">
        <span className="text-2xl">{STEPS[step].icon}</span>
        <h2 className="section-title">{STEPS[step].label} Seçimi</h2>
      </div>

      {step === 0 && (
        <div className="grid sm:grid-cols-2 gap-3 animate-slideUp">
          {shop.services.filter(s => s.active).map(s => (
            <button key={s.id} onClick={() => { setServiceId(s.id); next() }}
              className={`card text-left flex gap-3 hover:-translate-y-1 ${serviceId === s.id ? 'ring-2 ring-brand-600' : ''}`}>
              <img src={s.image} className="w-16 h-16 rounded-xl object-cover" />
              <div><p className="font-semibold">{s.name}</p><p className="text-xs text-gray-400">⏱ {s.duration} dk</p><p className="text-sm font-bold text-brand-600 mt-0.5">{s.price}₺</p></div>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="grid sm:grid-cols-2 gap-3 animate-slideUp">
          {eligibleStaff.map(p => (
            <button key={p.id} onClick={() => { setStaffId(p.id); next() }}
              className={`card text-left flex items-center gap-3 hover:-translate-y-1 ${staffId === p.id ? 'ring-2 ring-brand-600' : ''}`}>
              <span className="text-4xl">{p.avatar}</span>
              <div><p className="font-semibold">{p.name}</p><p className="text-xs text-gray-400">🕒 {p.hours}</p></div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-slideUp">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {dayOptions.map(d => (
              <button key={d} onClick={() => { setDate(d); setTime(null) }}
                className={`chip shrink-0 flex-col !gap-0 !py-2 ${date === d ? 'bg-brand-600 text-white border-brand-600 shadow-glow' : 'border-gray-200 dark:border-gray-700'}`}>
                <span className="block text-[10px] opacity-70">{DOW_SHORT[fromISODate(d).getDay()]}</span>
                <span className="block font-bold">{fromISODate(d).getDate()}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots().map(t => {
              const unavailable = takenTimes.has(t) || blockedTimes.has(t)
              return (
                <button key={t} disabled={unavailable} onClick={() => { setTime(t); next() }}
                  className={`chip justify-center ${unavailable ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 cursor-not-allowed border-transparent' : time === t ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:text-brand-600'}`}>
                  {t}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 animate-slideUp">
          <input className="input" placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Telefon (905xxxxxxxxx)" value={phone} onChange={e => setPhone(e.target.value)} />
          <button disabled={!name || !phone} onClick={next} className="btn-primary w-full !py-3">Devam Et →</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 animate-slideUp">
          <div className="card space-y-2.5 text-sm bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900">
            <Row label="Hizmet" value={`${service?.name} (${service?.price}₺)`} />
            <Row label="Usta" value={staff?.name} />
            <Row label="Tarih" value={`${formatTR(date)} · ${time}`} />
            <Row label="Müşteri" value={`${name} · ${phone}`} />
          </div>
          <button onClick={confirm} className="btn-primary w-full !py-3.5 text-base">✓ Randevuyu Onayla</button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
