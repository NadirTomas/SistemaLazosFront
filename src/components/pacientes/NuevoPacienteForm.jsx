import FormField from '../common/forms/FormField'
import TextInput from '../common/forms/TextInput'
import TextAreaInput from '../common/forms/TextAreaInput'
import PrimaryButton from '../common/forms/PrimaryButton'

function NuevoPacienteForm({ onSubmit }) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <FormField label="Nombre completo">
        <TextInput name="nombre_completo" required placeholder="Ingresá el nombre completo" />
      </FormField>
      <FormField label="DNI">
        <TextInput name="dni" required placeholder="Ingresá el DNI" />
      </FormField>
      <FormField label="Email">
        <TextInput name="email" type="email" placeholder="correo@lazos.com" />
      </FormField>
      <FormField label="Teléfono">
        <TextInput name="telefono" placeholder="Ej: 11 2345-6789" />
      </FormField>
      <FormField label="Obra social">
        <TextInput name="obra_social" placeholder="Ej: OSDE" />
      </FormField>
      <FormField label="Número de afiliado">
        <TextInput name="numero_afiliado" placeholder="Ej: 123456" />
      </FormField>
      <FormField label="Diagnóstico" fullWidth>
        <TextAreaInput name="diagnostico" rows="3" placeholder="Diagnóstico principal" />
      </FormField>
      <PrimaryButton className="full" type="submit">
        Guardar paciente
      </PrimaryButton>
    </form>
  )
}

export default NuevoPacienteForm
