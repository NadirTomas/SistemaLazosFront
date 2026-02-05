import FormField from '../common/forms/FormField'
import TextInput from '../common/forms/TextInput'
import SelectInput from '../common/forms/SelectInput'
import PrimaryButton from '../common/forms/PrimaryButton'

function TurnoForm({ onSubmit, patients, consultorios }) {
  const timeOptions = Array.from({ length: 21 }).map((_, index) => {
    const hour = 8 + Math.floor(index / 2)
    const minutes = index % 2 === 0 ? '00' : '30'
    return `${String(hour).padStart(2, '0')}:${minutes}`
  })

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <FormField label="Fecha">
        <TextInput name="fecha" type="date" required />
      </FormField>
      <FormField label="Paciente">
        <SelectInput name="paciente" required>
          <option value="">Seleccionar</option>
          {patients.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nombre_completo}
            </option>
          ))}
        </SelectInput>
      </FormField>
      <FormField label="Consultorio">
        <SelectInput name="consultorio" required>
          <option value="">Seleccionar</option>
          {consultorios.map((consultorio) => (
            <option key={consultorio.id} value={consultorio.id}>
              {consultorio.nombre} ({consultorio.numero})
            </option>
          ))}
        </SelectInput>
      </FormField>
      <FormField label="Inicio">
        <SelectInput name="inicio_hora" required>
          <option value="">Seleccionar</option>
          {timeOptions.slice(0, -1).map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </SelectInput>
      </FormField>
      <FormField label="Fin">
        <SelectInput name="fin_hora" required>
          <option value="">Seleccionar</option>
          {timeOptions.slice(1).map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </SelectInput>
      </FormField>
      <FormField label="Estado">
        <SelectInput name="estado" required>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EN_ESPERA">En espera</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="CANCELADO">Cancelado</option>
        </SelectInput>
      </FormField>
      <PrimaryButton className="full" type="submit">
        Crear turno
      </PrimaryButton>
    </form>
  )
}

export default TurnoForm
