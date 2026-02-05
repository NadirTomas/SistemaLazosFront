import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import SecuritySection from '../../components/SecuritySection'
import useAppContext from '../../hooks/useAppContext'

function SeguridadPage() {
  const { user, auditLogs, auditLoading, auditMessage, showToast, loadAuditLogs } =
    useAppContext()

  const isAdmin = user?.role === 'DUENA'

  useEffect(() => {
    if (!isAdmin) {
      showToast('Permisos no disponibles.', 'error')
    }
  }, [isAdmin, showToast])

  if (!isAdmin) {
    return <Navigate to="/inicio" replace />
  }

  useEffect(() => {
    loadAuditLogs()
  }, [])

  return (
    <SecuritySection
      logs={auditLogs}
      isLoading={auditLoading}
      message={auditMessage}
    />
  )
}

export default SeguridadPage
