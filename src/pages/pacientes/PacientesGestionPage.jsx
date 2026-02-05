import PacienteSelector from '../../components/pacientes/PacienteSelector'
import NuevoPacienteForm from '../../components/pacientes/NuevoPacienteForm'
import useAppContext from '../../hooks/useAppContext'

function PacientesGestionPage() {
  const {
    patients,
    patientsMessage,
    patientsLoading,
    selectedPatientId,
    setSelectedPatientId,
    handleCreatePatient,
  } = useAppContext()

  return (
    <section className="card">
      <PacienteSelector
        patients={patients}
        selectedPatientId={selectedPatientId}
        onChange={setSelectedPatientId}
      />
      {patientsLoading && <p className="message">Cargando pacientes...</p>}
      {patientsMessage && <p className="message">{patientsMessage}</p>}

      <h3>Nuevo paciente</h3>
      <NuevoPacienteForm onSubmit={handleCreatePatient} />
    </section>
  )
}

export default PacientesGestionPage
