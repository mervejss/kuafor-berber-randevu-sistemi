import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function Login({ onBack, onSuccess }) {
  const { login } = useApp()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(username, password)) {
      setError('')
      onSuccess()
    } else {
      setError('Kullanıcı adı veya şifre hatalı.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 text-white">
          <div className="text-5xl mb-2">💈</div>
          <h1 className="text-2xl font-bold">Kuaför Yönetim Paneli</h1>
          <p className="text-brand-100 text-sm mt-1">İşletmenize giriş yapın</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Kullanıcı Adı</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="kullanici_adi" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Şifre</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-rose-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Giriş Yap</button>
          <div className="text-center text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
            Demo hesap: <b>admin</b> / <b>admin123</b>
          </div>
        </form>
        <button onClick={onBack} className="w-full text-center text-brand-100 text-sm mt-4 underline">
          ← Müşteri vitrinine dön
        </button>
      </div>
    </div>
  )
}
