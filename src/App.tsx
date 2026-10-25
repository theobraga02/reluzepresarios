import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
const Landing = lazy(() => import('./pages/Landing'))
const Hoje = lazy(() => import('./pages/Hoje'))
const Painel = lazy(() => import('./pages/Painel'))
const Registrar = lazy(() => import('./pages/Registrar'))
const Aprender = lazy(() => import('./pages/Aprender'))
const Coach = lazy(() => import('./pages/Coach'))
const Agenda = lazy(() => import('./pages/Agenda'))
const Rede = lazy(() => import('./pages/Rede'))
const Negocio = lazy(() => import('./pages/Negocio'))
const Biblia = lazy(() => import('./pages/Biblia'))
const Mais = lazy(() => import('./pages/Mais'))

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppFrame() {
  return (
    <div className="app-root">
      <div className="app-frame">
        <Suspense fallback={<div className="scr" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppFrame />}>
          <Route index element={<Hoje />} />
          <Route path="painel" element={<Painel />} />
          <Route path="registrar" element={<Registrar />} />
          <Route path="aprender" element={<Aprender />} />
          <Route path="coach" element={<Coach />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="rede" element={<Rede />} />
          <Route path="negocio" element={<Negocio />} />
          <Route path="biblia" element={<Biblia />} />
          <Route path="mais" element={<Mais />} />
          <Route path="perfil" element={<Navigate to="/app/mais" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
