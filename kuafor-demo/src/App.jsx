import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import LandingPage from './components/public/LandingPage.jsx'
import Login from './components/Login.jsx'
import AdminShell from './components/admin/AdminShell.jsx'

function Root() {
  const { currentUser } = useApp()
  const [route, setRoute] = useState('public') // public | login

  if (currentUser) return <AdminShell onExit={() => setRoute('public')} />
  if (route === 'login') return <Login onBack={() => setRoute('public')} onSuccess={() => {}} />
  return <LandingPage onLoginClick={() => setRoute('login')} />
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}
