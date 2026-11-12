export function buildReminderMessage({ shopName, customerName, date, time, staffName, serviceName }) {
  return `Merhaba ${customerName}, ${shopName} olarak ${date} tarihinde saat ${time}'te ${staffName} ile ${serviceName} randevunuzu hatırlatmak isteriz. Bekliyoruz! 💈`
}

export function openWhatsApp(phone, message) {
  const cleanPhone = (phone || '').replace(/\D/g, '')
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
