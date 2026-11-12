import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { toISODate, fromISODate, formatTR, addDaysISO, startOfWeek, timeSlots, DOW_SHORT } from '../../utils/date.js'
import { buildReminderMessage, openWhatsApp } from '../../utils/whatsapp.js'

export default function CalendarView() {
  const { shop, addAppointment, updateAppointment, cancelAppointment, deleteAppointment, addBlockedSlot, removeBlockedSlot } = useApp()
  const toast = useToast()
  const [view, setView] = useState('day')
  const [cursor, setCursor] = useState(toISODate(new Date()))
  const [modal, setModal] = useState(null)

  const dayAppointments = (date) => shop.appointments.filter(a => a.date === date && a.status !== 'iptal')
  const dayBlocked = (date) => shop.blockedSlots.filter(b => b.date === date)
  const shiftDay = (n) => setCursor(addDaysISO(cursor, n))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3 animate-slideUp">
        <h1 className="font-display text-2xl font-bold tracking-tight">📅 Randevu Takvimi</h1>
        <div className="flex rounded-2xl bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
          {['day', 'week', 'month'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${view === v ? 'bg-white dark:bg-gray-900 shadow-md text-brand-600' : 'text-gray-400'}`}>
              {v === 'day' ? 'Gün' : v === 'week' ? 'Hafta' : 'Ay'}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-slideUp" style={{ animationDelay: '60ms' }}>
        {view === 'day' && (
          <DayView cursor={cursor} shiftDay={shiftDay} shop={shop} dayAppointments={dayAppointments} dayBlocked={dayBlocked}
            setModal={setModal} cancelAppointment={(id) => { cancelAppointment(id); toast.info('Randevu iptal edildi') }}
            deleteAppointment={deleteAppointment} removeBlockedSlot={removeBlockedSlot} />
        )}
        {view === 'week' && <WeekView cursor={cursor} setCursor={setCursor} shop={shop} dayAppointments={dayAppointments} setView={setView} />}
        {view === 'month' && <MonthView cursor={cursor} setCursor={setCursor} shop={shop} dayAppointments={dayAppointments} setView={setView} />}
      </div>

      <button onClick={() => setModal({ date: cursor })} className="fixed bottom-24 left-4 md:static btn-primary z-30 shadow-glow">+ Yeni Randevu</button>

      {modal && (
        <AppointmentModal modal={modal} shop={shop} onClose={() => setModal(null)}
          onSave={(data) => { modal.editing ? updateAppointment(modal.editing.id, data) : addAppointment(data); toast.success(modal.editing ? 'Randevu güncellendi' : 'Yeni randevu eklendi'); setModal(null) }}
          onBlock={(data) => { addBlockedSlot(data); toast.info('Saat kapatıldı'); setModal(null) }} />
      )}
    </div>
  )
}

function AppointmentRow({ a, shop, setModal, cancelAppointment }) {
  const staff = shop.staff.find(p => p.id === a.staffId)
  const service = shop.services.find(s => s.id === a.serviceId)
  const remind = () => openWhatsApp(a.phone, buildReminderMessage({
    shopName: shop.name, customerName: a.customerName, date: formatTR(a.date), time: a.time,
    staffName: staff?.name || '', serviceName: service?.name || ''
  }))
  return (
    <div className="card !p-3.5 flex items-center justify-between gap-2 hover:-translate-y-0.5">
      <div className="min-w-0 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-lg shrink-0">{staff?.avatar || '👤'}</span>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{a.time} · {a.customerName}</p>
          <p className="text-xs text-gray-400 truncate">{service?.name} · {staff?.name} · {a.phone}</p>
          <span className={`badge mt-1 inline-block ${a.status === 'onaylandi' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
            {a.status === 'onaylandi' ? 'Onaylı' : 'Bekliyor'}
          </span>
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button title="WhatsApp ile Hatırlat" onClick={remind} className="btn-success btn-icon shadow-md shadow-emerald-500/20">💬</button>
        <button title="Düzenle" onClick={() => setModal({ editing: a, date: a.date })} className="btn-secondary btn-icon">✏️</button>
        <button title="İptal" onClick={() => cancelAppointment(a.id)} className="btn-danger btn-icon !bg-rose-50 !text-rose-600 !from-rose-50 !to-rose-50 !shadow-none hover:!bg-rose-100">✕</button>
      </div>
    </div>
  )
}

function DayView({ cursor, shiftDay, shop, dayAppointments, dayBlocked, setModal, cancelAppointment, removeBlockedSlot }) {
  const apts = dayAppointments(cursor).sort((a, b) => a.time.localeCompare(b.time))
  const blocked = dayBlocked(cursor)
  const slots = timeSlots()
  const takenTimes = new Set(apts.map(a => a.time))
  const blockedTimes = new Set(blocked.map(b => b.time))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between card !p-3 bg-gradient-to-r from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900">
        <button onClick={() => shiftDay(-1)} className="btn-secondary btn-icon">←</button>
        <p className="font-display font-bold">{formatTR(cursor)}</p>
        <button onClick={() => shiftDay(1)} className="btn-secondary btn-icon">→</button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 mb-2.5 flex items-center gap-1.5">📋 Randevular <span className="badge bg-gray-100 dark:bg-gray-800">{apts.length}</span></h3>
        <div className="space-y-2">
          {apts.length === 0 && <p className="text-sm text-gray-400 py-6 text-center">✨ Bu gün için randevu yok.</p>}
          {apts.map(a => <AppointmentRow key={a.id} a={a} shop={shop} setModal={setModal} cancelAppointment={cancelAppointment} />)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 mb-2.5">🕒 Saat Slotları</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {slots.map(t => {
            const taken = takenTimes.has(t)
            const isBlocked = blockedTimes.has(t)
            const blockEntry = blocked.find(b => b.time === t)
            return (
              <button key={t}
                onClick={() => {
                  if (isBlocked) { removeBlockedSlot(blockEntry.id); return }
                  if (!taken) setModal({ date: cursor, time: t })
                }}
                className={`chip justify-center font-bold ${
                  taken ? 'bg-rose-50 border-rose-200 text-rose-500 cursor-not-allowed dark:bg-rose-900/20 dark:border-rose-800' :
                  isBlocked ? 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500' :
                  'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
                }`}>
                {t}{isBlocked ? ' 🚫' : ''}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2.5 flex flex-wrap gap-x-3">
          <span>🟢 Boş</span><span>🔴 Dolu</span><span>⚪ Kapalı (tekrar aç için tıkla)</span>
        </p>
      </div>
    </div>
  )
}

function WeekView({ cursor, setCursor, shop, dayAppointments, setView }) {
  const monday = startOfWeek(cursor)
  const days = Array.from({ length: 7 }, (_, i) => addDaysISO(monday, i))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
      {days.map(d => {
        const apts = dayAppointments(d).sort((a, b) => a.time.localeCompare(b.time))
        const dow = fromISODate(d).getDay()
        const isToday = d === toISODate(new Date())
        return (
          <div key={d} className={`card !p-3 cursor-pointer hover:-translate-y-1 ${isToday ? 'ring-2 ring-brand-500' : ''}`} onClick={() => { setCursor(d); setView('day') }}>
            <p className="text-xs text-gray-400 font-semibold">{DOW_SHORT[dow]}</p>
            <p className="font-display font-bold mb-2">{formatTR(d).split(' ').slice(0, 2).join(' ')}</p>
            <div className="space-y-1">
              {apts.slice(0, 4).map(a => (
                <p key={a.id} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-lg px-2 py-1 truncate font-medium">
                  {a.time} {a.customerName}
                </p>
              ))}
              {apts.length === 0 && <p className="text-xs text-gray-300">Boş</p>}
              {apts.length > 4 && <p className="text-xs text-gray-400">+{apts.length - 4} daha</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MonthView({ cursor, setCursor, shop, dayAppointments, setView }) {
  const d = fromISODate(cursor)
  const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(toISODate(new Date(d.getFullYear(), d.getMonth(), i)))

  const monthLabel = `${['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][d.getMonth()]} ${d.getFullYear()}`

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between card !p-3 bg-gradient-to-r from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900">
        <button onClick={() => setCursor(toISODate(new Date(d.getFullYear(), d.getMonth() - 1, 1)))} className="btn-secondary btn-icon">←</button>
        <p className="font-display font-bold">{monthLabel}</p>
        <button onClick={() => setCursor(toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 1)))} className="btn-secondary btn-icon">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 font-semibold">
        {['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(x => <div key={x}>{x}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c, i) => {
          if (!c) return <div key={i} />
          const apts = dayAppointments(c)
          const isToday = c === toISODate(new Date())
          return (
            <button key={i} onClick={() => { setCursor(c); setView('day') }}
              className={`aspect-square rounded-2xl border text-xs flex flex-col items-center justify-center gap-0.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${isToday ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-100 dark:border-gray-800'}`}>
              <span className="font-bold">{fromISODate(c).getDate()}</span>
              {apts.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AppointmentModal({ modal, shop, onClose, onSave, onBlock }) {
  const editing = modal.editing
  const [date, setDate] = useState(modal.date)
  const [time, setTime] = useState(modal.time || editing?.time || timeSlots()[0])
  const [serviceId, setServiceId] = useState(editing?.serviceId || shop.services.find(s => s.active)?.id || '')
  const [staffId, setStaffId] = useState(editing?.staffId || shop.staff[0]?.id || '')
  const [customerName, setCustomerName] = useState(editing?.customerName || '')
  const [phone, setPhone] = useState(editing?.phone || '')

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-3.5 max-h-[90vh] overflow-auto animate-slideUp sm:animate-scaleIn" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-lg font-bold">{editing ? '✏️ Randevuyu Düzenle' : '➕ Yeni Randevu'}</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <div><label className="text-xs text-gray-400 font-semibold">Tarih</label><input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} /></div>
          <div><label className="text-xs text-gray-400 font-semibold">Saat</label>
            <select className="input" value={time} onChange={e => setTime(e.target.value)}>
              {timeSlots().map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 font-semibold">Hizmet</label>
          <select className="input" value={serviceId} onChange={e => setServiceId(e.target.value)}>
            {shop.services.filter(s => s.active).map(s => <option key={s.id} value={s.id}>{s.name} - {s.price}₺</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 font-semibold">Personel</label>
          <select className="input" value={staffId} onChange={e => setStaffId(e.target.value)}>
            {shop.staff.map(p => <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>)}
          </select>
        </div>
        <div><label className="text-xs text-gray-400 font-semibold">Müşteri Adı</label><input className="input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ad Soyad" /></div>
        <div><label className="text-xs text-gray-400 font-semibold">Telefon</label><input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="905xxxxxxxxx" /></div>

        <div className="flex gap-2 pt-2">
          <button className="btn-secondary flex-1" onClick={onClose}>Vazgeç</button>
          {!editing && <button className="btn-secondary flex-1" onClick={() => onBlock({ date, time, staffId, reason: 'Kapalı' })}>🚫 Kapat</button>}
          <button className="btn-primary flex-1" onClick={() => onSave({ date, time, serviceId, staffId, customerName, phone, status: editing?.status || 'onaylandi' })}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}
