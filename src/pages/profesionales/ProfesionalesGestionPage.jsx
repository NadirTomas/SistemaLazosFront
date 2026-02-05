import { useEffect } from 'react'
import AdminUsers from '../../components/AdminUsers'
import useAppContext from '../../hooks/useAppContext'

function ProfesionalesGestionPage() {
  const {
    users,
    usersMessage,
    usersLoading,
    loadUsers,
    handleToggleEnabled,
    handleCreateUser,
    handleUpdateUser,
    handleSendInvite,
  } = useAppContext()

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <AdminUsers
      users={users}
      onRefresh={loadUsers}
      onToggleEnabled={handleToggleEnabled}
      onCreateUser={handleCreateUser}
      onUpdateUser={handleUpdateUser}
      onSendInvite={handleSendInvite}
      message={usersMessage}
      isLoading={usersLoading}
    />
  )
}

export default ProfesionalesGestionPage
