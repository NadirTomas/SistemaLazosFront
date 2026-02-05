function TurnosList({ turnos }) {
  return (
    <ul className="list">
      {turnos.map((turno) => (
        <li key={turno.id}>
          <strong>{turno.inicio.replace('T', ' ')}</strong>
          <span>Paciente #{turno.paciente}</span>
          <span>Consultorio #{turno.consultorio}</span>
          <span>{turno.estado}</span>
        </li>
      ))}
    </ul>
  )
}

export default TurnosList
