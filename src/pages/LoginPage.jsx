import { useState } from 'react'
import logoLazos from '../assets/lazos-logo.png'
import '../components/login.css'
import TextInput from '../components/common/forms/TextInput'
import PrimaryButton from '../components/common/forms/PrimaryButton'

function LoginPage({
  onLogin,
  loading,
  message,
  inviteToken,
  onAcceptInvite,
  onInviteConsumed,
}) {
  const [isInviteMode, setIsInviteMode] = useState(Boolean(inviteToken))
  const [invitePassword, setInvitePassword] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)

  async function handleInviteSubmit(event) {
    event.preventDefault()
    setInviteMessage('')
    setInviteLoading(true)
    try {
      await onAcceptInvite(inviteToken, invitePassword)
      setInviteMessage('Contraseña creada. Ya podés iniciar sesión.')
      setInvitePassword('')
      onInviteConsumed()
      setIsInviteMode(false)
    } catch (error) {
      setInviteMessage(error.message)
    } finally {
      setInviteLoading(false)
    }
  }

  return (
    <div className={`login-shell ${isInviteMode ? 'active' : ''}`}>
      <div className="login-container" id="login-container">
        <div className="form-container sign-in">
          <form onSubmit={onLogin}>
            <img className="login-logo" src={logoLazos} alt="Lazos Digital" />
            <h1>Iniciar sesión</h1>
            <span>Ingresá con tu email y contraseña</span>
            <TextInput name="email" type="email" placeholder="Email" required />
            <TextInput name="password" type="password" placeholder="Contraseña" required />
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </PrimaryButton>
            {message && <p className="login-message">{message}</p>}
          </form>
        </div>

        <div className="form-container sign-up">
          <form onSubmit={handleInviteSubmit}>
            <h1>Activar cuenta</h1>
            <span>Creá tu contraseña para completar la invitación</span>
            <TextInput
              type="password"
              placeholder="Nueva contraseña"
              value={invitePassword}
              onChange={(event) => setInvitePassword(event.target.value)}
              required
            />
            <PrimaryButton type="submit" disabled={inviteLoading}>
              {inviteLoading ? 'Guardando...' : 'Crear contraseña'}
            </PrimaryButton>
            {inviteMessage && <p className="login-message">{inviteMessage}</p>}
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>¿Ya tenés cuenta?</h1>
              <p>Ingresá con tus credenciales para continuar.</p>
              <button
                className="hidden"
                type="button"
                onClick={() => setIsInviteMode(false)}
              >
                Iniciar sesión
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>¿Te invitaron?</h1>
              <p>Creá tu contraseña y activá tu cuenta.</p>
              <button
                className="hidden"
                type="button"
                onClick={() => setIsInviteMode(true)}
                disabled={!inviteToken}
                title={!inviteToken ? 'Necesitás un link de invitación' : undefined}
              >
                Activar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
