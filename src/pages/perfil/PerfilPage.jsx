import ProfileSection from '../../components/ProfileSection'
import useAppContext from '../../hooks/useAppContext'

function PerfilPage() {
  const { user, handleUpdateProfile, handleChangePassword, profileMessage } =
    useAppContext()

  return (
    <ProfileSection
      user={user}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      message={profileMessage}
    />
  )
}

export default PerfilPage
