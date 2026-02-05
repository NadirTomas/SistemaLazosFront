import SecondaryButton from './common/forms/SecondaryButton'

function Header({ user, onToggleMenu, onLogout }) {
  return (
    <header className="header">
      <button className="menu-button" type="button" onClick={onToggleMenu}>
        ☰
      </button>
      <div>
        <h1>Lazos Digital</h1>
        <p>Frontend mínimo para agenda y pacientes</p>
      </div>
      {user && (
        <div className="header-actions">
          <div className="user-chip">
            <span>{user.email}</span>
            <small>{user.role}</small>
          </div>
          <SecondaryButton type="button" onClick={onLogout}>
            Cerrar sesión
          </SecondaryButton>
        </div>
      )}
    </header>
  )
}

export default Header
