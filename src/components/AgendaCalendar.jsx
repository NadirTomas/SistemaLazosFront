import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import FormField from './common/forms/FormField'
import SelectInput from './common/forms/SelectInput'
import SecondaryButton from './common/forms/SecondaryButton'

const locales = {
  'es-AR': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
})

const DragAndDropCalendar = withDragAndDrop(Calendar)

function AgendaCalendar({
  consultorios,
  selectedConsultorios,
  onSelectedConsultoriosChange,
  turnos,
  patients,
  weekStart,
  onWeekChange,
  onMoveTurno,
}) {
  const patientMap = useMemo(() => {
    const map = new Map()
    patients.forEach((patient) => {
      map.set(String(patient.id), patient.nombre_completo)
    })
    return map
  }, [patients])

  const resources = useMemo(() => {
    const selected = new Set(selectedConsultorios)
    const data =
      selectedConsultorios.length === 0
        ? consultorios
        : consultorios.filter((consultorio) => selected.has(consultorio.id))
    return data.map((consultorio) => ({
      resourceId: consultorio.id,
      resourceTitle: consultorio.nombre,
    }))
  }, [consultorios, selectedConsultorios])

  const events = useMemo(() => {
    const selected = new Set(selectedConsultorios)
    const data =
      selectedConsultorios.length === 0
        ? turnos
        : turnos.filter((turno) => selected.has(turno.consultorio))
    return data.map((turno) => ({
      id: turno.id,
      title: patientMap.get(String(turno.paciente)) || `Paciente #${turno.paciente}`,
      start: new Date(turno.inicio),
      end: new Date(turno.fin),
      resourceId: turno.consultorio,
      estado: turno.estado,
    }))
  }, [turnos, patientMap, selectedConsultorios])

  const eventPropGetter = (event) => {
    const baseStyle = {
      borderRadius: '8px',
      border: 'none',
      padding: '2px 6px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#1f2937',
    }
    const stylesByState = {
      CONFIRMADO: { background: '#dbeafe' },
      EN_ESPERA: { background: '#dcfce7' },
      FINALIZADO: { background: '#e5e7eb' },
      CANCELADO: { background: '#fee2e2' },
    }
    return {
      style: { ...baseStyle, ...(stylesByState[event.estado] || {}) },
    }
  }

  return (
    <section className="card calendar-card">
      <div className="row space-between">
        <h2>Agenda semanal</h2>
        <div className="row">
          <FormField label="Consultorio">
            <SelectInput
              className="compact"
              value={selectedConsultorios.length ? String(selectedConsultorios[0]) : 'all'}
              onChange={(event) => {
                const value = event.target.value
                if (value === 'all') {
                  onSelectedConsultoriosChange([])
                  return
                }
                onSelectedConsultoriosChange([Number(value)])
              }}
            >
              <option value="all">Todos los consultorios</option>
              {consultorios.map((consultorio) => (
                <option key={consultorio.id} value={consultorio.id}>
                  {consultorio.nombre}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <SecondaryButton type="button" onClick={() => onWeekChange(-7)}>
            ◀ Semana
          </SecondaryButton>
          <SecondaryButton type="button" onClick={() => onWeekChange(7)}>
            Semana ▶
          </SecondaryButton>
        </div>
      </div>

      <div className="calendar-wrapper">
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          startAccessor="start"
          endAccessor="end"
          defaultView="work_week"
          views={['work_week']}
          date={weekStart}
          onNavigate={(date) => onWeekChange(date)}
          step={30}
          timeslots={1}
          min={new Date(1970, 0, 1, 8, 0)}
          max={new Date(1970, 0, 1, 18, 0)}
          eventPropGetter={eventPropGetter}
          onEventDrop={(event) => {
            if (!event?.start || !event?.end) return
            onMoveTurno(event.id, event.start, event.end, event.resourceId)
          }}
          onEventResize={(event) => {
            if (!event?.start || !event?.end) return
            onMoveTurno(event.id, event.start, event.end, event.resourceId)
          }}
          resizable
          draggableAccessor={() => true}
        />
      </div>
    </section>
  )
}

export default AgendaCalendar
