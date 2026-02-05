import FormField from '../common/forms/FormField'
import TextAreaInput from '../common/forms/TextAreaInput'
import PrimaryButton from '../common/forms/PrimaryButton'

function EvolucionForm({ onSubmit }) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <FormField label="Nota clínica" fullWidth>
        <TextAreaInput name="texto" rows="4" required placeholder="Escribí la evolución clínica" />
      </FormField>
      <PrimaryButton type="submit" className="full">
        Guardar evolución
      </PrimaryButton>
    </form>
  )
}

export default EvolucionForm
