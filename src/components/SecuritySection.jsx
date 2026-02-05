function SecuritySection({ logs, isLoading, message }) {
  return (
    <section className="card">
      <h2>Seguridad y cumplimiento</h2>
      <p>
        Registro de acciones críticas y avisos de privacidad. Esta sección está
        disponible solo para la Dueña.
      </p>

      <div className="card-inset">
        <h3>Registro de auditoría</h3>
        {isLoading && <p className="message">Cargando registros...</p>}
        {message && <p className="message">{message}</p>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Actor</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.actor_email || 'Sistema'}</td>
                  <td>{log.action}</td>
                  <td>{log.target_type}</td>
                  <td>{log.target_id}</td>
                </tr>
              ))}
              {!logs.length && !isLoading && (
                <tr>
                  <td colSpan="5">Sin registros</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-inset">
        <h3>Avisos de privacidad</h3>
        <p>
          Este sistema gestiona información sensible de salud. Se recomienda
          publicar términos y políticas de privacidad en un documento formal
          antes de uso en producción.
        </p>
      </div>
    </section>
  )
}

export default SecuritySection
