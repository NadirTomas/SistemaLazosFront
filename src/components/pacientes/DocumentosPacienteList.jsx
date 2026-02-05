import FormField from '../common/forms/FormField'
import TextInput from '../common/forms/TextInput'
import PrimaryButton from '../common/forms/PrimaryButton'

function DocumentosPacienteList({ documents, onUpload }) {
  return (
    <div className="card">
      <h3>Documentos</h3>
      <form className="form-grid" onSubmit={onUpload}>
        <FormField label="Nombre del documento">
          <TextInput name="nombre" required placeholder="Ej: Consentimiento" />
        </FormField>
        <FormField label="Archivo">
          <input name="archivo" type="file" required className="form-input" />
        </FormField>
        <PrimaryButton type="submit" className="full">
          Subir documento
        </PrimaryButton>
      </form>
      <ul className="list">
        {documents.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.nombre}</strong>
            <a href={doc.archivo} target="_blank" rel="noreferrer">
              Descargar
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DocumentosPacienteList
