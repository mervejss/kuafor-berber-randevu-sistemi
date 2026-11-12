import React, { useRef, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { toISODate, addDaysISO } from '../../utils/date.js'

const EXAMPLES = [
  'Yarın saat 15:00 Ahmet\'e saç kesimi randevusu',
  'Mehmet 300 lira verdi',
  'Hasan\'a 200 lira veresiye yaz',
  'Bugün saat 11:00 Ayşe\'ye sakal tıraşı randevusu',
]

function parseCommand(text, shop) {
  const lower = text.toLocaleLowerCase('tr-TR')

  const aptMatch = lower.match(/(bugün|yarın|öbür gün)?.*?saat\s*(\d{1,2})[:.]?(\d{2})?.*?(?:'(?:e|a|ye|ya))?\s+([a-zçğıöşü]+)('?[ea]|'?ye|'?ya)?\s+(.*?)\s*randevu/)
  if (aptMatch) {
    const [, gun, h, m, isim, , hizmetRaw] = aptMatch
    let date = toISODate(new Date())
    if (gun === 'yarın') date = addDaysISO(date, 1)
    if (gun === 'öbür gün') date = addDaysISO(date, 2)
    const time = `${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}`
    const service = shop.services.find(s => hizmetRaw && (hizmetRaw.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(hizmetRaw.trim())))
    const customerName = isim.charAt(0).toUpperCase() + isim.slice(1)
    return {
      action: 'appointment',
      data: { date, time, customerName, serviceId: service?.id || shop.services[0]?.id, staffId: shop.staff[0]?.id, phone: '905000000000', status: 'onaylandi' },
      summary: `${customerName} için ${date} ${time} saatine ${service?.name || 'hizmet'} randevusu oluşturuldu.`
    }
  }

  const payMatch = lower.match(/([a-zçğıöşü]+)\s+(\d+)\s*(?:tl|lira)\s*(?:verdi|ödedi)/)
  if (payMatch) {
    const [, isim, amount] = payMatch
    const customerName = isim.charAt(0).toUpperCase() + isim.slice(1)
    return {
      action: 'income',
      data: { type: 'giris', method: 'nakit', amount: Number(amount), desc: `${customerName} - sesli komutla girildi`, date: toISODate(new Date()) },
      summary: `${customerName} adına ${amount}₺ kasaya nakit giriş kaydedildi.`
    }
  }

  const creditMatch = lower.match(/([a-zçğıöşü]+)('?[ae]|'?ya|'?ye)?\s+(\d+)\s*(?:tl|lira)\s*veresiye/)
  if (creditMatch) {
    const [, isim, , amount] = creditMatch
    const customerName = isim.charAt(0).toUpperCase() + isim.slice(1)
    return {
      action: 'credit',
      data: { customerName, phone: '905000000000', amount: Number(amount), date: toISODate(new Date()) },
      summary: `${customerName} adına ${amount}₺ veresiye defterine eklendi.`
    }
  }

  return { action: 'unknown', summary: 'Komut anlaşılamadı. Lütfen örneklerdeki gibi bir cümle deneyin.' }
}

export default function VoiceAssistant({ onClose }) {
  const { shop, addAppointment, addTransaction, addCredit } = useApp()
  const toast = useToast()
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const recRef = useRef(null)

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setResult({ action: 'unknown', summary: 'Bu tarayıcı sesli tanımayı desteklemiyor. Lütfen metin kutusunu kullanın.' })
      return
    }
    const rec = new SR()
    rec.lang = 'tr-TR'
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setText(transcript)
      runCommand(transcript)
    }
    rec.start()
    recRef.current = rec
  }

  const runCommand = (t) => {
    if (!t.trim()) return
    const parsed = parseCommand(t, shop)
    setResult(parsed)
  }

  const applyResult = () => {
    if (!result) return
    if (result.action === 'appointment') addAppointment(result.data)
    if (result.action === 'income') addTransaction(result.data)
    if (result.action === 'credit') addCredit(result.data)
    setResult({ ...result, applied: true })
    toast.success('İşlem kaydedildi')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-4 animate-slideUp sm:animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="relative inline-block">
            {listening && <span className="absolute inset-0 rounded-full bg-rose-500 animate-ringPulse" />}
            <button onClick={startListening}
              className={`relative w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl text-white shadow-2xl transition-all duration-300 bg-gradient-to-br ${listening ? 'from-rose-600 to-rose-700 scale-110' : 'from-rose-400 to-rose-600 hover:scale-105'}`}>
              🎙️
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-3 font-medium">{listening ? '🔴 Dinleniyor...' : 'Konuşmak için mikrofona dokun'}</p>
        </div>

        <div className="flex gap-2">
          <input className="input" placeholder="...veya buraya yazın" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && runCommand(text)} />
          <button className="btn-primary !px-5" onClick={() => runCommand(text)}>Gönder</button>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">💡 Örnek komutlar</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => { setText(ex); runCommand(ex) }} className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 rounded-full px-3.5 py-2 transition-colors font-medium">{ex}</button>
            ))}
          </div>
        </div>

        {result && (
          <div className="card !bg-gradient-to-br !from-brand-50 !to-brand-100/50 dark:!from-brand-900/30 dark:!to-brand-900/10 !border-0 animate-scaleIn">
            <p className="text-sm font-medium">{result.summary}</p>
            {result.action !== 'unknown' && !result.applied && (
              <button onClick={applyResult} className="btn-success w-full mt-3">✓ Onayla ve Kaydet</button>
            )}
            {result.applied && <p className="text-emerald-600 text-sm font-bold mt-2 flex items-center gap-1">✅ Kaydedildi</p>}
          </div>
        )}

        <button onClick={onClose} className="btn-secondary w-full">Kapat</button>
      </div>
    </div>
  )
}
