import React, { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'

export default function ServiceManager() {
  const { shop, addService, updateService, deleteService } = useApp()
  const [modal, setModal] = useState(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Hizmetler & Fiyat Listesi</h1>
        <button onClick={() => setModal('new')} className="btn-primary">+ Ekle</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {shop.services.map(s => (
          <div key={s.id} className={`card flex gap-3 ${!s.active ? 'opacity-50' : ''}`}>
            <img src={s.image} alt={s.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{s.name}</p>
              <p className="text-xs text-gray-400 truncate">{s.desc}</p>
              <p className="text-sm font-bold text-brand-600 mt-1">{s.price}₺ · {s.duration} dk</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setModal(s)} className="btn-secondary !py-1 !px-2.5 text-xs">Düzenle</button>
                <button onClick={() => updateService(s.id, { active: !s.active })} className="btn-secondary !py-1 !px-2.5 text-xs">{s.active ? 'Menüden Kaldır' : 'Menüye Ekle'}</button>
                <button onClick={() => deleteService(s.id)} className="btn-danger !py-1 !px-2.5 text-xs">Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ServiceModal service={modal === 'new' ? null : modal} onClose={() => setModal(null)}
          onSave={(data) => { modal === 'new' ? addService(data) : updateService(modal.id, data); setModal(null) }} />
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
    <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 space-y-3 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{service ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}</h2>
        <input className="input" placeholder="Hizmet adı" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="input" placeholder="Açıklama" value={desc} onChange={e => setDesc(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <div><label className="text-xs text-gray-400">Süre (dk)</label><input className="input" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} /></div>
          <div><label className="text-xs text-gray-400">Fiyat (₺)</label><input className="input" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>
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
