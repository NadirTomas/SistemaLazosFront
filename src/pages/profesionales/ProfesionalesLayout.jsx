import { useEffect } from 'react'
import { NavLink, Outlet, Navigate } from 'react-router-dom'
import useAppContext from '../../hooks/useAppContext'
import '../../styles/profesionales.css'

function ProfesionalesLayout() {
  const { user, showToast } = useAppContext()

  const isAdmin = user?.role === 'DUENA'

  useEffect(() => {
    if (!isAdmin) {
      showToast('Permisos no disponibles.', 'error')
    }
  }, [isAdmin, showToast])

  if (!isAdmin) {
    return <Navigate to="/inicio" replace />
  }

  return (
    <section className="module">
      <div className="page-header">
        <h1>Profesionales</h1>
      </div>
      <div className="module-tabs">
        <NavLink
          to="gestion"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Gestión
        </NavLink>
        <NavLink
          to="permisos"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Permisos
        </NavLink>
      </div>
      <Outlet />
    </section>
  )
}

export default ProfesionalesLayout
