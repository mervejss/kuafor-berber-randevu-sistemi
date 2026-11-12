import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { toISODate, addDaysISO, formatTR, timeSlots } from '../../utils/date.js'

const STEPS = ['Hizmet', 'Usta', 'Zaman', 'Bilgiler', 'Onay']

export default function BookingFlow({ shop, onBack }) {
  const { publicBook } = useApp()
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
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="card max-w-sm">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-xl font-bold mb-2">Randevunuz Alındı!</h2>
          <p className="text-sm text-gray-500 mb-4">{formatTR(date)} saat {time} için {service?.name} randevunuz, {staff?.name} ile oluşturuldu. İşletme onayınızı WhatsApp üzerinden iletecektir.</p>
          <button onClick={onBack} className="btn-primary w-full">Ana Sayfaya Dön</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={back} className="btn-secondary !px-3">←</button>
        <div className="flex-1 flex gap-1">
          {STEPS.map((s, i) => <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-800'}`} />)}
        </div>
      </div>
      <h2 className="text-lg font-bold mb-4">{STEPS[step]} Seçimi</h2>

      {step === 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {shop.services.filter(s => s.active).map(s => (
            <button key={s.id} onClick={() => { setServiceId(s.id); next() }} className={`card text-left flex gap-3 ${serviceId === s.id ? 'ring-2 ring-brand-600' : ''}`}>
              <img src={s.image} className="w-16 h-16 rounded-xl object-cover" />
              <div><p className="font-semibold">{s.name}</p><p className="text-xs text-gray-400">{s.duration} dk</p><p className="text-sm font-bold text-brand-600">{s.price}₺</p></div>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {eligibleStaff.map(p => (
            <button key={p.id} onClick={() => { setStaffId(p.id); next() }} className={`card text-left flex items-center gap-3 ${staffId === p.id ? 'ring-2 ring-brand-600' : ''}`}>
              <span className="text-3xl">{p.avatar}</span>
              <div><p className="font-semibold">{p.name}</p><p className="text-xs text-gray-400">{p.hours}</p></div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dayOptions.map(d => (
              <button key={d} onClick={() => { setDate(d); setTime(null) }} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium border ${date === d ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-gray-700'}`}>
                {formatTR(d)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots().map(t => {
              const unavailable = takenTimes.has(t) || blockedTimes.has(t)
              return (
                <button key={t} disabled={unavailable} onClick={() => { setTime(t); next() }}
                  className={`rounded-xl py-2 text-xs font-medium border ${unavailable ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 cursor-not-allowed' : time === t ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-gray-700'}`}>
                  {t}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <input className="input" placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Telefon (905xxxxxxxxx)" value={phone} onChange={e => setPhone(e.target.value)} />
          <button disabled={!name || !phone} onClick={next} className="btn-primary w-full disabled:opacity-40">Devam Et</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="card space-y-1 text-sm">
            <p><b>Hizmet:</b> {service?.name} ({service?.price}₺)</p>
            <p><b>Usta:</b> {staff?.name}</p>
            <p><b>Tarih:</b> {formatTR(date)} · {time}</p>
            <p><b>Müşteri:</b> {name} · {phone}</p>
          </div>
          <button onClick={confirm} className="btn-primary w-full">✓ Randevuyu Onayla</button>
        </div>
      )}
    </div>
  )
}
