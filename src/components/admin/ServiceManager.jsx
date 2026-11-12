import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function ServiceManager() {
  const { shop, addService, updateService, deleteService } = useApp()
  const toast = useToast()
  const [modal, setModal] = useState(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between animate-slideUp">
        <h1 className="font-display text-2xl font-bold tracking-tight">✂️ Hizmetler & Fiyat Listesi</h1>
        <button onClick={() => setModal('new')} className="btn-primary">+ Ekle</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {shop.services.map((s, i) => (
          <div key={s.id} className={`card flex gap-3 animate-slideUp hover:-translate-y-1 ${!s.active ? 'opacity-50' : ''}`} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold">{s.name}</p>
                {!s.active && <span className="badge bg-gray-200 dark:bg-gray-700 text-gray-500">Pasif</span>}
              </div>
              <p className="text-xs text-gray-400 truncate">{s.desc}</p>
              <p className="text-sm font-bold text-brand-600 mt-1">{s.price}₺ · ⏱ {s.duration} dk</p>
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                <button onClick={() => setModal(s)} className="btn-secondary !py-1.5 !px-3 text-xs">✏️ Düzenle</button>
                <button onClick={() => { updateService(s.id, { active: !s.active }); toast.info(s.active ? 'Menüden kaldırıldı' : 'Menüye eklendi') }} className="btn-secondary !py-1.5 !px-3 text-xs">{s.active ? '👁️‍🗨️ Kaldır' : '👁️ Ekle'}</button>
                <button onClick={() => { deleteService(s.id); toast.info('Hizmet silindi') }} className="btn-danger !py-1.5 !px-3 text-xs">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ServiceModal service={modal === 'new' ? null : modal} onClose={() => setModal(null)}
          onSave={(data) => { modal === 'new' ? addService(data) : updateService(modal.id, data); toast.success(modal === 'new' ? 'Yeni hizmet eklendi' : 'Hizmet güncellendi'); setModal(null) }} />
      )}
    </div>
  )
}

function ServiceModal({ service, onClose, onSave }) {
  const [name, setName] = useState(service?.name || '')
  const [desc, setDesc] = useState(service?.desc || '')
  const [duration, setDuration] = useState(service?.duration || 30)
  const [price, setPrice] = useState(service?.price || 100)
  const [image, setImage] = useState(service?.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop')

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-3.5 max-h-[90vh] overflow-auto animate-slideUp sm:animate-scaleIn" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-lg font-bold">{service ? '✏️ Hizmeti Düzenle' : '➕ Yeni Hizmet'}</h2>
        <img src={image} className="w-full h-32 object-cover rounded-2xl" onError={e => e.target.style.opacity = 0.3} />
        <input className="input" placeholder="Hizmet adı" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="input" placeholder="Açıklama" value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
        <div className="grid grid-cols-2 gap-2.5">
          <div><label className="text-xs text-gray-400 font-semibold">Süre (dk)</label><input className="input" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} /></div>
          <div><label className="text-xs text-gray-400 font-semibold">Fiyat (₺)</label><input className="input" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>
        </div>
        <input className="input" placeholder="Görsel URL" value={image} onChange={e => setImage(e.target.value)} />
        <div className="flex gap-2 pt-1">
          <button className="btn-secondary flex-1" onClick={onClose}>Vazgeç</button>
          <button className="btn-primary flex-1" onClick={() => onSave({ name, desc, duration, price, image })}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}
