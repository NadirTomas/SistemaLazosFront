function EvolucionList({ evolutions }) {
  return (
    <div className="timeline">
      {evolutions.map((evolution) => (
        <div key={evolution.id} className="timeline-item">
          <div className="timeline-marker" />
          <div className="timeline-content">
            <strong>{new Date(evolution.creado_en).toLocaleString()}</strong>
            <span>
              Profesional:{' '}
              {evolution.profesional_nombre ||
                evolution.profesional_email ||
                'Sin dato'}
            </span>
            <p>{evolution.texto}</p>
          </div>
        </div>
      ))}
      {!evolutions.length && (
        <p className="timeline-empty">Sin evoluciones registradas.</p>
      )}
    </div>
  )
}

export default EvolucionList
