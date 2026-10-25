import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Hoje from './pages/Hoje'
import Painel from './pages/Painel'
import Registrar from './pages/Registrar'
import Aprender from './pages/Aprender'
import Coach from './pages/Coach'
import Agenda from './pages/Agenda'
import Rede from './pages/Rede'
import Negocio from './pages/Negocio'
import Biblia from './pages/Biblia'
import Mais from './pages/Mais'

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
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
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
    </>
  )
}
