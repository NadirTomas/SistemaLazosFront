import { useEffect } from 'react'
import AgendaCalendar from '../../components/AgendaCalendar'
import useAppContext from '../../hooks/useAppContext'

function AgendaCalendarioPage() {
  const {
    consultorios,
    selectedConsultorios,
    setSelectedConsultorios,
    turnos,
    turnosLoading,
    patients,
    weekStart,
    handleWeekChange,
    handleMoveTurno,
    loadTurnosRange,
  } = useAppContext()

  useEffect(() => {
    loadTurnosRange(weekStart)
  }, [weekStart])

  return (
    <>
      {turnosLoading && <p className="message">Cargando turnos...</p>}
      <AgendaCalendar
        consultorios={consultorios}
        selectedConsultorios={selectedConsultorios}
        onSelectedConsultoriosChange={setSelectedConsultorios}
        turnos={turnos}
        patients={patients}
        weekStart={weekStart}
        onWeekChange={handleWeekChange}
        onMoveTurno={handleMoveTurno}
      />
    </>
  )
}

export default AgendaCalendarioPage
