import { NavLink, Outlet } from 'react-router-dom'
import '../../styles/agenda.css'

function AgendaLayout() {
  return (
    <section className="module">
      <div className="page-header">
        <h1>Agenda</h1>
      </div>
      <div className="module-tabs">
        <NavLink
          to="calendario"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Calendario
        </NavLink>
        <NavLink
          to="resumen"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Resumen
        </NavLink>
      </div>
      <Outlet />
    </section>
  )
}

export default AgendaLayout
