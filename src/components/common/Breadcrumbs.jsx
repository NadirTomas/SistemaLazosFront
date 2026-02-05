import { useLocation } from 'react-router-dom'

const routeNames = {
  '/inicio': 'Inicio',
  '/agenda': 'Agenda',
  '/agenda/calendario': 'Calendario',
  '/agenda/resumen': 'Resumen',
  '/pacientes': 'Pacientes',
  '/pacientes/gestion': 'Gestión de pacientes',
  '/pacientes/historia-clinica': 'Historia clínica',
  '/pacientes/carpeta': 'Carpeta del paciente',
  '/turnos': 'Turnos',
  '/turnos/gestion': 'Gestión',
  '/turnos/listado': 'Listado',
  '/perfil': 'Perfil',
  '/seguridad': 'Seguridad',
  '/terminos': 'Términos y Privacidad',
  '/profesionales': 'Profesionales',
  '/profesionales/gestion': 'Gestión',
  '/profesionales/permisos': 'Permisos',
}

function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (!segments.length) {
    return null
  }

  const crumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    return {
      path,
      label: routeNames[path] || segment,
      isLast: index === segments.length - 1,
    }
  })

  return (
    <div className="breadcrumbs">
      {crumbs.map((crumb) => (
        <span key={crumb.path} className={crumb.isLast ? 'current' : ''}>
          {crumb.label}
          {!crumb.isLast && <span className="separator">/</span>}
        </span>
      ))}
    </div>
  )
}

export default Breadcrumbs
