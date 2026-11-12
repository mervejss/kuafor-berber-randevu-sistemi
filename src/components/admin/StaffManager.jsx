import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { DOW_SHORT } from '../../utils/date.js'

export default function StaffManager() {
  const { shop, addStaff, updateStaff, deleteStaff } = useApp()
  const [modal, setModal] = useState(null) // null | 'new' | staff object

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Personel Yönetimi</h1>
        <button onClick={() => setModal('new')} className="btn-primary">+ Ekle</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {shop.staff.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{p.avatar}</span>
              <div className="flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-gray-400">{p.hours} · İzin: {p.offDays.map(d => DOW_SHORT[d]).join(', ') || 'Yok'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {p.specialties.map(sid => {
                const s = shop.services.find(x => x.id === sid)
                return s ? <span key={sid} className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">{s.name}</span> : null
              })}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setModal(p)} className="btn-secondary flex-1 !py-1.5 text-sm">Düzenle</button>
              <button onClick={() => deleteStaff(p.id)} className="btn-danger flex-1 !py-1.5 text-sm">Sil</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <StaffModal staff={modal === 'new' ? null : modal} services={shop.services} onClose={() => setModal(null)}
          onSave={(data) => { modal === 'new' ? addStaff(data) : updateStaff(modal.id, data); setModal(null) }} />
      )}
    </div>
  )
}

function StaffModal({ staff, services, onClose, onSave }) {
  const [name, setName] = useState(staff?.name || '')
  const [avatar, setAvatar] = useState(staff?.avatar || '🧑')
  const [hours, setHours] = useState(staff?.hours || '09:00-21:00')
  const [specialties, setSpecialties] = useState(staff?.specialties || [])
  const [offDays, setOffDays] = useState(staff?.offDays || [])

  const toggle = (arr, set, val) => set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 space-y-3 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{staff ? 'Personeli Düzenle' : 'Yeni Personel'}</h2>
        <input className="input" placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="Avatar emoji" value={avatar} onChange={e => setAvatar(e.target.value)} />
        <input className="input" placeholder="Çalışma saatleri (örn 09:00-21:00)" value={hours} onChange={e => setHours(e.target.value)} />

        <div>
          <p className="text-xs text-gray-400 mb-1">Uzmanlık (hizmetler)</p>
          <div className="flex flex-wrap gap-1.5">
            {services.map(s => (
              <button key={s.id} onClick={() => toggle(specialties, setSpecialties, s.id)}
                className={`text-xs rounded-full px-3 py-1.5 border ${specialties.includes(s.id) ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-gray-700'}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">İzin günleri</p>
          <div className="flex flex-wrap gap-1.5">
            {DOW_SHORT.map((d, i) => (
              <button key={i} onClick={() => toggle(offDays, setOffDays, i)}
                className={`text-xs rounded-full px-3 py-1.5 border ${offDays.includes(i) ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button className="btn-secondary flex-1" onClick={onClose}>Vazgeç</button>
          <button className="btn-primary flex-1" onClick={() => onSave({ name, avatar, hours, specialties, offDays })}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}
