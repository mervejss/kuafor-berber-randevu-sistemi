import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loadDB, saveDB, uid } from '../data/seed.js'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export function AppProvider({ children }) {
  const [db, setDb] = useState(() => loadDB())
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('kuafor_session') || null)

  useEffect(() => { saveDB(db) }, [db])

  const login = useCallback((username, password) => {
    const user = db.users[username]
    if (user && user.password === password) {
      sessionStorage.setItem('kuafor_session', username)
      setCurrentUser(username)
      return true
    }
    return false
  }, [db])

  const logout = useCallback(() => {
    sessionStorage.removeItem('kuafor_session')
    setCurrentUser(null)
  }, [])

  const shopId = currentUser ? db.users[currentUser]?.shopId : null
  const shop = shopId ? db.shops[shopId] : null

  const updateShop = useCallback((updater) => {
    setDb(prev => {
      const sid = prev.users[currentUser]?.shopId
      if (!sid) return prev
      const prevShop = prev.shops[sid]
      const nextShop = typeof updater === 'function' ? updater(prevShop) : { ...prevShop, ...updater }
      return { ...prev, shops: { ...prev.shops, [sid]: nextShop } }
    })
  }, [currentUser])

  // ---- Appointments ----
  const addAppointment = (apt) => updateShop(s => ({ ...s, appointments: [...s.appointments, { id: uid('a'), status: 'onaylandi', ...apt }] }))
  const updateAppointment = (id, patch) => updateShop(s => ({ ...s, appointments: s.appointments.map(a => a.id === id ? { ...a, ...patch } : a) }))
  const cancelAppointment = (id) => updateAppointment(id, { status: 'iptal' })
  const deleteAppointment = (id) => updateShop(s => ({ ...s, appointments: s.appointments.filter(a => a.id !== id) }))

  // ---- Blocked slots ----
  const addBlockedSlot = (slot) => updateShop(s => ({ ...s, blockedSlots: [...s.blockedSlots, { id: uid('b'), ...slot }] }))
  const removeBlockedSlot = (id) => updateShop(s => ({ ...s, blockedSlots: s.blockedSlots.filter(b => b.id !== id) }))

  // ---- Finance ----
  const addTransaction = (tx) => updateShop(s => ({ ...s, transactions: [...s.transactions, { id: uid('t'), ...tx }] }))
  const addCredit = (c) => updateShop(s => ({ ...s, credits: [...s.credits, { id: uid('c'), paid: false, ...c }] }))
  const payCredit = (id) => updateShop(s => {
    const credit = s.credits.find(c => c.id === id)
    if (!credit) return s
    return {
      ...s,
      credits: s.credits.map(c => c.id === id ? { ...c, paid: true } : c),
      transactions: [...s.transactions, { id: uid('t'), type: 'giris', method: 'nakit', amount: credit.amount, desc: `Veresiye tahsilat - ${credit.customerName}`, date: new Date().toISOString().slice(0, 10) }]
    }
  })
  const addStaffAdvance = (adv) => updateShop(s => ({ ...s, staffAdvances: [...s.staffAdvances, { id: uid('ad'), ...adv }] }))

  // ---- Staff ----
  const addStaff = (st) => updateShop(s => ({ ...s, staff: [...s.staff, { id: uid('p'), ...st }] }))
  const updateStaff = (id, patch) => updateShop(s => ({ ...s, staff: s.staff.map(p => p.id === id ? { ...p, ...patch } : p) }))
  const deleteStaff = (id) => updateShop(s => ({ ...s, staff: s.staff.filter(p => p.id !== id) }))

  // ---- Services ----
  const addService = (sv) => updateShop(s => ({ ...s, services: [...s.services, { id: uid('s'), active: true, ...sv }] }))
  const updateService = (id, patch) => updateShop(s => ({ ...s, services: s.services.map(sv => sv.id === id ? { ...sv, ...patch } : sv) }))
  const deleteService = (id) => updateShop(s => ({ ...s, services: s.services.filter(sv => sv.id !== id) }))

  // Public booking (no auth needed) -- books into the demo shop directly
  const publicBook = (targetShopId, apt) => {
    setDb(prev => {
      const prevShop = prev.shops[targetShopId]
      const nextShop = { ...prevShop, appointments: [...prevShop.appointments, { id: uid('a'), status: 'beklemede', ...apt }] }
      return { ...prev, shops: { ...prev.shops, [targetShopId]: nextShop } }
    })
  }

  const value = {
    db, shop, currentUser, login, logout,
    addAppointment, updateAppointment, cancelAppointment, deleteAppointment,
    addBlockedSlot, removeBlockedSlot,
    addTransaction, addCredit, payCredit, addStaffAdvance,
    addStaff, updateStaff, deleteStaff,
    addService, updateService, deleteService,
    publicBook,
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
