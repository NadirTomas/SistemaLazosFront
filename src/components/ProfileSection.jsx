import { useState } from 'react'
import FormField from './common/forms/FormField'
import TextInput from './common/forms/TextInput'
import PrimaryButton from './common/forms/PrimaryButton'

function ProfileSection({ user, onUpdateProfile, onChangePassword, message }) {
  const [formValues, setFormValues] = useState({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  })
  const [newPassword, setNewPassword] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className="card">
      <h2>Perfil</h2>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault()
          onUpdateProfile(formValues)
        }}
      >
        <FormField label="Email">
          <TextInput name="email" type="email" value={formValues.email} onChange={handleChange} />
        </FormField>
        <FormField label="Nombre">
          <TextInput name="first_name" value={formValues.first_name} onChange={handleChange} />
        </FormField>
        <FormField label="Apellido">
          <TextInput name="last_name" value={formValues.last_name} onChange={handleChange} />
        </FormField>
        <PrimaryButton type="submit" className="full">
          Guardar cambios
        </PrimaryButton>
      </form>

      <div className="card-inset">
        <h3>Cambiar contraseña</h3>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault()
            if (!newPassword.trim()) return
            onChangePassword(newPassword)
            setNewPassword('')
          }}
        >
          <FormField label="Nueva contraseña" fullWidth>
            <TextInput
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </FormField>
          <PrimaryButton type="submit" className="full">
            Actualizar contraseña
          </PrimaryButton>
        </form>
      </div>

      {message && <p className="message">{message}</p>}
    </section>
  )
}

export default ProfileSection
