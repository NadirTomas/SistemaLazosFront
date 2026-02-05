import { Link } from 'react-router-dom'
import useAppContext from '../hooks/useAppContext'

function NotFoundPage() {
  const { authToken } = useAppContext()
  const backTo = authToken ? '/inicio' : '/login'
  const label = authToken ? 'Volver al inicio' : 'Ir al login'

  return (
    <section className="card">
      <h2>Página no encontrada</h2>
      <p>La ruta solicitada no existe.</p>
      <Link className="btn-primary" to={backTo}>
        {label}
      </Link>
    </section>
  )
}

export default NotFoundPage
