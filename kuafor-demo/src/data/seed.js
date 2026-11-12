// Demo veritabanı iskeleti. Gerçek backend yok; her şey localStorage'da tutulur.
export const STORAGE_KEY = 'kuafor_demo_db_v1'

const today = new Date()
const iso = (d) => d.toISOString().slice(0, 10)
const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d) }

export function buildSeedDB() {
  return {
    users: {
      admin: {
        password: 'admin123',
        shopId: 'berber-ramazan'
      }
    },
    shops: {
      'berber-ramazan': {
        id: 'berber-ramazan',
        name: 'Berber Ramazan',
        slogan: 'Şehrin en şık kesimi, 1998\'den beri',
        address: 'Mevlana Cad. No:12, Karatay / Konya',
        phone: '905321234567',
        workHours: '09:00 - 21:00 (Pazar hariç her gün)',
        coverImage: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1200&auto=format&fit=crop',
        logoEmoji: '💈',
        services: [
          { id: 's1', name: 'Saç Kesimi', desc: 'Makas & tıraş makinesi ile şekillendirme', duration: 30, price: 250, active: true, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop' },
          { id: 's2', name: 'Sakal Tıraşı', desc: 'Jilet ile klasik sakal tıraşı', duration: 20, price: 150, active: true, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop' },
          { id: 's3', name: 'Saç + Sakal', desc: 'Komple bakım paketi', duration: 45, price: 350, active: true, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop' },
          { id: 's4', name: 'Çocuk Kesimi', desc: '12 yaş altı çocuklara özel kesim', duration: 25, price: 180, active: true, image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop' },
          { id: 's5', name: 'Cilt Bakımı', desc: 'Maske ve nemlendirme', duration: 30, price: 300, active: false, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop' },
        ],
        staff: [
          { id: 'p1', name: 'Ramazan Usta', specialties: ['s1', 's2', 's3'], offDays: [0], hours: '09:00-21:00', avatar: '🧔' },
          { id: 'p2', name: 'Emre Kalfa', specialties: ['s1', 's4'], offDays: [0, 1], hours: '10:00-19:00', avatar: '✂️' },
          { id: 'p3', name: 'Burak Çırak', specialties: ['s1', 's2'], offDays: [0], hours: '09:00-18:00', avatar: '🧑' },
        ],
        appointments: [
          { id: 'a1', date: addDays(0), time: '14:00', serviceId: 's1', staffId: 'p1', customerName: 'Ahmet Yılmaz', phone: '905551112233', status: 'onaylandi', note: '' },
          { id: 'a2', date: addDays(0), time: '15:30', serviceId: 's3', staffId: 'p1', customerName: 'Mehmet Demir', phone: '905552223344', status: 'onaylandi', note: '' },
          { id: 'a3', date: addDays(1), time: '11:00', serviceId: 's2', staffId: 'p2', customerName: 'Hasan Kaya', phone: '905553334455', status: 'onaylandi', note: '' },
          { id: 'a4', date: addDays(1), time: '16:00', serviceId: 's4', staffId: 'p3', customerName: 'Ali Veli', phone: '905554445566', status: 'onaylandi', note: '' },
          { id: 'a5', date: addDays(2), time: '13:00', serviceId: 's1', staffId: 'p2', customerName: 'Can Öz', phone: '905555556677', status: 'beklemede', note: '' },
        ],
        blockedSlots: [
          { id: 'b1', date: addDays(1), time: '09:00', staffId: 'p1', reason: 'Mola' },
        ],
        transactions: [
          { id: 't1', type: 'giris', method: 'nakit', amount: 250, desc: 'Ahmet Yılmaz - Saç Kesimi', date: addDays(0) },
          { id: 't2', type: 'giris', method: 'kart', amount: 350, desc: 'Mehmet Demir - Saç+Sakal', date: addDays(0) },
          { id: 't3', type: 'cikis', method: 'nakit', amount: 120, desc: 'Malzeme alışverişi', date: addDays(0) },
          { id: 't4', type: 'cikis', method: 'nakit', amount: 500, desc: 'Emre Kalfa - Avans', date: addDays(-1) },
          { id: 't5', type: 'giris', method: 'nakit', amount: 150, desc: 'Hasan Kaya - Sakal Tıraşı', date: addDays(-1) },
        ],
        credits: [
          { id: 'c1', customerName: 'Hasan Kaya', phone: '905553334455', amount: 200, date: addDays(-2), paid: false },
          { id: 'c2', customerName: 'Veli Can', phone: '905556667788', amount: 100, date: addDays(-5), paid: false },
        ],
        staffAdvances: [
          { id: 'ad1', staffId: 'p2', amount: 500, date: addDays(-1), note: 'Nakit avans' },
        ],
      }
    }
  }
}

export function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const fresh = buildSeedDB()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    return fresh
  }
  try { return JSON.parse(raw) } catch { const fresh = buildSeedDB(); localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); return fresh }
}

export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function resetDB() {
  const fresh = buildSeedDB()
  saveDB(fresh)
  return fresh
}

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`
