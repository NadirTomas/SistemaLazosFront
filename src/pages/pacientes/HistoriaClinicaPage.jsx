import PacienteSelector from '../../components/pacientes/PacienteSelector'
import EvolucionForm from '../../components/pacientes/EvolucionForm'
import EvolucionList from '../../components/pacientes/EvolucionList'
import useAppContext from '../../hooks/useAppContext'
import SecondaryButton from '../../components/common/forms/SecondaryButton'

function HistoriaClinicaPage() {
  const {
    patients,
    patientsLoading,
    selectedPatientId,
    setSelectedPatientId,
    evolutions,
    handleCreateEvolution,
    folderMessage,
  } = useAppContext()

  return (
    <section className="card">
      <PacienteSelector
        patients={patients}
        selectedPatientId={selectedPatientId}
        onChange={setSelectedPatientId}
      />
      {patientsLoading && <p className="message">Cargando pacientes...</p>}
      <div className="row space-between">
        <h3>Historia clínica</h3>
        <SecondaryButton type="button">Nueva evolución</SecondaryButton>
      </div>
      <EvolucionForm onSubmit={handleCreateEvolution} />
      <EvolucionList evolutions={evolutions} />
      {folderMessage && <p className="message">{folderMessage}</p>}
    </section>
  )
}

export default HistoriaClinicaPage
