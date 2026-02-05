import { useMemo, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import html2pdf from 'html2pdf.js'
import FormField from '../common/forms/FormField'
import TextInput from '../common/forms/TextInput'
import PrimaryButton from '../common/forms/PrimaryButton'
import SecondaryButton from '../common/forms/SecondaryButton'

function InformesSection({
  reports,
  onCreateReport,
  onUpdateReport,
  onAttachReportPdf,
}) {
  const [reportTitle, setReportTitle] = useState('')
  const [reportContent, setReportContent] = useState('')
  const [editingReportId, setEditingReportId] = useState(null)

  const editorConfig = useMemo(
    () => ({
      height: 320,
      menubar: false,
      plugins: 'lists link table',
      toolbar:
        'undo redo | formatselect | bold italic underline | bullist numlist | alignleft aligncenter alignright | table | link',
      content_style:
        'body { font-family: Inter, Arial, sans-serif; font-size: 14px; }',
    }),
    []
  )

  async function createPdfBlob(html) {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const worker = html2pdf().from(wrapper).toPdf()
    const pdf = await worker.get('pdf')
    return pdf.output('blob')
  }

  return (
    <div className="card">
      <h3>Informes (tipo Word)</h3>
      <div className="form-grid">
        <FormField label="Título del informe" fullWidth>
          <TextInput
            value={reportTitle}
            onChange={(event) => setReportTitle(event.target.value)}
            placeholder="Ej: Informe de evolución"
          />
        </FormField>
        <div className="full editor-box">
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'}
            value={reportContent}
            init={editorConfig}
            onEditorChange={(content) => setReportContent(content)}
          />
        </div>
        <PrimaryButton
          type="button"
          className="full"
          onClick={() => {
            const titulo = reportTitle.trim()
            const contenidoHtml = reportContent.trim()
            if (!titulo || !contenidoHtml) {
              return
            }
            if (editingReportId) {
              onUpdateReport(editingReportId, { titulo, contenidoHtml })
              setEditingReportId(null)
            } else {
              onCreateReport({ titulo, contenidoHtml })
            }
            setReportTitle('')
            setReportContent('')
          }}
        >
          {editingReportId ? 'Actualizar informe' : 'Guardar informe'}
        </PrimaryButton>
        {editingReportId && (
          <SecondaryButton
            type="button"
            className="full"
            onClick={() => {
              setEditingReportId(null)
              setReportTitle('')
              setReportContent('')
            }}
          >
            Cancelar edición
          </SecondaryButton>
        )}
      </div>
      <ul className="list">
        {reports.map((report) => (
          <li key={report.id}>
            <strong>{report.titulo}</strong>
            <span>
              {new Date(report.actualizado_en).toLocaleString()} ·{' '}
              {report.profesional_nombre || report.profesional_email || 'Sin dato'}
            </span>
            <div className="row">
              <SecondaryButton
                type="button"
                disabled={
                  Date.now() - new Date(report.creado_en).getTime() >
                  30 * 24 * 60 * 60 * 1000
                }
                title={
                  Date.now() - new Date(report.creado_en).getTime() >
                  30 * 24 * 60 * 60 * 1000
                    ? 'Informe bloqueado por antigüedad (más de 30 días).'
                    : 'Editar informe'
                }
                onClick={() => {
                  const isLocked =
                    Date.now() - new Date(report.creado_en).getTime() >
                    30 * 24 * 60 * 60 * 1000
                  if (isLocked) {
                    return
                  }
                  setEditingReportId(report.id)
                  setReportTitle(report.titulo)
                  setReportContent(report.contenido_html || '')
                }}
              >
                Editar
              </SecondaryButton>
              <SecondaryButton
                type="button"
                onClick={async () => {
                  const blob = await createPdfBlob(report.contenido_html || '')
                  await onAttachReportPdf(report, blob)
                }}
              >
                Adjuntar PDF
              </SecondaryButton>
              <SecondaryButton
                type="button"
                onClick={() => {
                  const wrapper = document.createElement('div')
                  wrapper.innerHTML = report.contenido_html
                  html2pdf().from(wrapper).save(`${report.titulo}.pdf`)
                }}
              >
                Exportar PDF
              </SecondaryButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InformesSection
