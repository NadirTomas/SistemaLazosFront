import { useState } from 'react'
import FormField from './common/forms/FormField'
import TextInput from './common/forms/TextInput'
import SelectInput from './common/forms/SelectInput'
import PrimaryButton from './common/forms/PrimaryButton'
import SecondaryButton from './common/forms/SecondaryButton'

function AdminUsers({
  users,
  onRefresh,
  onToggleEnabled,
  onCreateUser,
  onUpdateUser,
  onSendInvite,
  message,
  isLoading,
}) {
  const [editingId, setEditingId] = useState(null)
  const [formValues, setFormValues] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'PROFESIONAL',
    is_enabled: false,
    password: '',
  })
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('PROFESIONAL')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setFormValues({
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role || 'PROFESIONAL',
      is_enabled: Boolean(user.is_enabled),
      password: '',
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormValues({
      email: '',
      first_name: '',
      last_name: '',
      role: 'PROFESIONAL',
      is_enabled: false,
      password: '',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
      email: formValues.email.trim(),
      first_name: formValues.first_name.trim(),
      last_name: formValues.last_name.trim(),
      role: formValues.role,
      is_enabled: formValues.is_enabled,
    }
    if (formValues.password.trim()) {
      payload.password = formValues.password
    }

    if (editingId) {
      await onUpdateUser(editingId, payload)
      handleCancel()
      return
    }
    await onCreateUser(payload)
    handleCancel()
  }

  return (
    <section className="card">
      <div className="row space-between">
        <h2>Gestión de profesionales</h2>
        <SecondaryButton type="button" onClick={onRefresh}>
          Actualizar
        </SecondaryButton>
      </div>

      {isLoading && <p className="message">Cargando usuarios...</p>}
      {message && <p className="message">{message}</p>}

      <div className="card-inset">
        <h3>Enviar invitación</h3>
        <div className="form-grid">
          <FormField label="Email">
            <TextInput
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
          </FormField>
          <FormField label="Rol">
            <SelectInput value={inviteRole} onChange={(event) => setInviteRole(event.target.value)}>
              <option value="PROFESIONAL">Profesional</option>
              <option value="DUENA">Dueña</option>
            </SelectInput>
          </FormField>
          <PrimaryButton
            type="button"
            className="full"
            onClick={() => {
              const email = inviteEmail.trim()
              if (!email) {
                return
              }
              onSendInvite({ email, role: inviteRole })
              setInviteEmail('')
              setInviteRole('PROFESIONAL')
            }}
          >
            Enviar invitación
          </PrimaryButton>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <FormField label="Email">
          <TextInput name="email" type="email" value={formValues.email} onChange={handleChange} required />
        </FormField>
        <FormField label="Nombre">
          <TextInput name="first_name" value={formValues.first_name} onChange={handleChange} />
        </FormField>
        <FormField label="Apellido">
          <TextInput name="last_name" value={formValues.last_name} onChange={handleChange} />
        </FormField>
        <FormField label="Rol">
          <SelectInput name="role" value={formValues.role} onChange={handleChange}>
            <option value="PROFESIONAL">Profesional</option>
            <option value="DUENA">Dueña</option>
          </SelectInput>
        </FormField>
        <FormField label="Contraseña">
          <TextInput
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder={editingId ? 'Dejar vacío para mantener' : 'Asignar contraseña'}
          />
        </FormField>
        <label className="checkbox-field full">
          <input
            name="is_enabled"
            type="checkbox"
            checked={formValues.is_enabled}
            onChange={handleChange}
          />
          Habilitado
        </label>
        <PrimaryButton type="submit" className="full">
          {editingId ? 'Actualizar profesional' : 'Crear profesional'}
        </PrimaryButton>
        {editingId && (
          <SecondaryButton type="button" className="full" onClick={handleCancel}>
            Cancelar edición
          </SecondaryButton>
        )}
      </form>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div>
              <strong>{user.email}</strong>
              <p>Rol: {user.role}</p>
              <p>Habilitado: {user.is_enabled ? 'Sí' : 'No'}</p>
            </div>
            <div className="row">
              <SecondaryButton type="button" onClick={() => handleEdit(user)}>
                Editar
              </SecondaryButton>
              {user.is_enabled ? (
                <SecondaryButton type="button" onClick={() => onToggleEnabled(user)}>
                  Deshabilitar
                </SecondaryButton>
              ) : (
                <PrimaryButton type="button" onClick={() => onToggleEnabled(user)}>
                  Habilitar
                </PrimaryButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminUsers
