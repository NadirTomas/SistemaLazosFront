import TurnoForm from '../../components/turnos/TurnoForm'
import useAppContext from '../../hooks/useAppContext'

function TurnosGestionPage() {
  const { handleCreateTurno, patients, consultorios, turnosMessage } = useAppContext()

  return (
    <section className="card">
      <h3>Nuevo turno</h3>
      <TurnoForm
        onSubmit={handleCreateTurno}
        patients={patients}
        consultorios={consultorios}
      />
      {turnosMessage && <p className="message">{turnosMessage}</p>}
    </section>
  )
}

export default TurnosGestionPage
