function PacienteResumenCard({ patient }) {
  if (!patient) {
    return (
      <div className="card">
        <p>Seleccioná un paciente para ver la carpeta.</p>
      </div>
    )
  }

  return (
    <div className="patient-card">
      <div>
        <strong>{patient.nombre_completo}</strong>
        <p>DNI: {patient.dni}</p>
      </div>
      <div>
        <p>Email: {patient.email || 'Sin email'}</p>
        <p>Teléfono: {patient.telefono || 'Sin teléfono'}</p>
      </div>
      <div>
        <p>Obra social: {patient.obra_social || 'Sin obra social'}</p>
        <p>Afiliado: {patient.numero_afiliado || 'Sin dato'}</p>
      </div>
    </div>
  )
}

export default PacienteResumenCard
