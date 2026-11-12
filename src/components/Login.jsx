import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Login({ onBack, onSuccess }) {
  const { login } = useApp()
  const toast = useToast()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (login(username, password)) {
        setError('')
        toast.success('Giriş başarılı, hoş geldiniz!')
        onSuccess()
      } else {
        setError('Kullanıcı adı veya şifre hatalı.')
        setLoading(false)
      }
    }, 450)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-950 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-900 to-gray-950" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-400/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

      <div className="w-full max-w-sm relative animate-slideUp">
        <div className="text-center mb-6 text-white">
          <div className="text-6xl mb-3 animate-popIn drop-shadow-lg">💈</div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Kuaför Yönetim Paneli</h1>
          <p className="text-brand-100/80 text-sm mt-1.5">İşletmenize giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-4 border border-white/20">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Kullanıcı Adı</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="kullanici_adi" autoComplete="username" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Şifre</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <p className="text-rose-500 text-sm font-medium animate-slideUp">⚠️ {error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 text-base">
            {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Giriş Yap →</>}
          </button>
          <div className="text-center text-xs text-brand-800 dark:text-brand-200 bg-brand-50 dark:bg-brand-900/40 rounded-2xl p-3 font-medium">
            🔑 Demo hesap: <b>admin</b> / <b>admin123</b>
          </div>
        </form>
        <button onClick={onBack} className="w-full text-center text-brand-100/80 hover:text-white text-sm mt-5 font-medium transition-colors">
          ← Müşteri vitrinine dön
        </button>
      </div>
    </div>
  )
}
