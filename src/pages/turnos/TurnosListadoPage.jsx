import { useEffect } from 'react'
import TurnosList from '../../components/turnos/TurnosList'
import useAppContext from '../../hooks/useAppContext'
import FormField from '../../components/common/forms/FormField'
import TextInput from '../../components/common/forms/TextInput'
import SecondaryButton from '../../components/common/forms/SecondaryButton'

function TurnosListadoPage() {
  const { turnos, loadTurnos, turnosMessage, turnosLoading } = useAppContext()

  useEffect(() => {
    loadTurnos()
  }, [])

  return (
    <section className="card">
      <div className="row space-between">
        <h3>Listado de turnos</h3>
        <div className="row">
          <FormField label="Fecha">
            <TextInput type="date" onChange={(event) => loadTurnos(event.target.value)} />
          </FormField>
          <SecondaryButton type="button" onClick={() => loadTurnos()}>
            Ver
          </SecondaryButton>
        </div>
      </div>
      <TurnosList turnos={turnos} />
      {turnosLoading && <p className="message">Cargando turnos...</p>}
      {turnosMessage && <p className="message">{turnosMessage}</p>}
    </section>
  )
}

export default TurnosListadoPage
