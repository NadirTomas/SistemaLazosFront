import { NavLink, Outlet } from 'react-router-dom'

function TurnosLayout() {
  return (
    <section className="module">
      <div className="page-header">
        <h1>Turnos</h1>
      </div>
      <div className="module-tabs">
        <NavLink
          to="gestion"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Gestión
        </NavLink>
        <NavLink
          to="listado"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Listado
        </NavLink>
      </div>
      <Outlet />
    </section>
  )
}

export default TurnosLayout
