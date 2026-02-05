import FormField from '../common/forms/FormField'
import SelectInput from '../common/forms/SelectInput'

function PacienteSelector({ patients, selectedPatientId, onChange }) {
  return (
    <FormField label="Paciente seleccionado" fullWidth>
      <SelectInput value={selectedPatientId || ''} onChange={(event) => onChange(event.target.value)}>
        <option value="">Seleccionar paciente</option>
        {patients.map((paciente) => (
          <option key={paciente.id} value={paciente.id}>
            {paciente.nombre_completo}
          </option>
        ))}
      </SelectInput>
    </FormField>
  )
}

export default PacienteSelector
