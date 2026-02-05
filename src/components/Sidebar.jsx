import { NavLink } from 'react-router-dom'

const menuItems = [
  { id: 'inicio', label: 'Inicio', to: '/inicio' },
  { id: 'agenda', label: 'Agenda', to: '/agenda' },
  { id: 'pacientes', label: 'Pacientes', to: '/pacientes' },
  { id: 'turnos', label: 'Turnos', to: '/turnos' },
  { id: 'perfil', label: 'Perfil', to: '/perfil' },
  { id: 'seguridad', label: 'Seguridad', to: '/seguridad' },
  { id: 'terminos', label: 'Términos y Privacidad', to: '/terminos' },
  { id: 'admin', label: 'Profesionales', to: '/profesionales' },
]

function Sidebar({ isOpen, isMobile, isAdmin, onNavigate }) {
  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--collapsed'} ${
        isMobile ? 'sidebar--mobile' : ''
      }`}
    >
      <div className="sidebar-header">Menú</div>
      <nav className="sidebar-nav">
        {menuItems
          .filter((item) => {
            if (item.id === 'admin' || item.id === 'seguridad') {
              return isAdmin
            }
            return true
          })
          .map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
              onClick={onNavigate}
              title={item.label}
            >
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}

export default Sidebar
