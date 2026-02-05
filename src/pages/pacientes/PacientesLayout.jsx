import { NavLink, Outlet } from 'react-router-dom'
import '../../styles/pacientes.css'

function PacientesLayout() {
  return (
    <section className="module">
      <div className="page-header">
        <h1>Pacientes</h1>
      </div>
      <div className="module-tabs">
        <NavLink
          to="gestion"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Gestión de pacientes
        </NavLink>
        <NavLink
          to="historia-clinica"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Historia clínica
        </NavLink>
        <NavLink
          to="carpeta"
          className={({ isActive }) => `module-tab ${isActive ? 'active' : ''}`}
        >
          Carpeta del paciente
        </NavLink>
      </div>
      <Outlet />
    </section>
  )
}

export default PacientesLayout
