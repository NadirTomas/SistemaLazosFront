import { Navigate, Outlet } from 'react-router-dom'
import useAppContext from '../../hooks/useAppContext'

function ProtectedRoute() {
  const { authToken } = useAppContext()

  if (!authToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
