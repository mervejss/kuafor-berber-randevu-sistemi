export const DOW = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
export const DOW_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

export function toISODate(d) { return d.toISOString().slice(0, 10) }
export function fromISODate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export function formatTR(s) {
  const d = fromISODate(s)
  return `${d.getDate()} ${['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'][d.getMonth()]} ${d.getFullYear()}`
}
export function addDaysISO(s, n) { const d = fromISODate(s); d.setDate(d.getDate() + n); return toISODate(d) }
export function startOfWeek(s) { const d = fromISODate(s); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); return toISODate(d) }

export function timeSlots(startH = 9, endH = 21, stepMin = 30) {
  const out = []
  for (let m = startH * 60; m < endH * 60; m += stepMin) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const mm = (m % 60).toString().padStart(2, '0')
    out.push(`${h}:${mm}`)
  }
  return out
}
