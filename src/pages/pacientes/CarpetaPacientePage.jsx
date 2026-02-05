import PacienteSelector from '../../components/pacientes/PacienteSelector'
import PacienteResumenCard from '../../components/pacientes/PacienteResumenCard'
import DocumentosPacienteList from '../../components/pacientes/DocumentosPacienteList'
import InformesSection from '../../components/pacientes/InformesSection'
import useAppContext from '../../hooks/useAppContext'

function CarpetaPacientePage() {
  const {
    patients,
    patientsLoading,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    documents,
    reports,
    handleUploadDocument,
    handleCreateReport,
    handleUpdateReport,
    handleAttachReportPdf,
    folderMessage,
    folderLoading,
  } = useAppContext()

  return (
    <section className="card">
      <PacienteSelector
        patients={patients}
        selectedPatientId={selectedPatientId}
        onChange={setSelectedPatientId}
      />
      {patientsLoading && <p className="message">Cargando pacientes...</p>}
      {folderLoading && <p className="message">Cargando carpeta...</p>}
      <PacienteResumenCard patient={selectedPatient} />
      <div className="folder-grid">
        <InformesSection
          reports={reports}
          onCreateReport={handleCreateReport}
          onUpdateReport={handleUpdateReport}
          onAttachReportPdf={handleAttachReportPdf}
        />
        <DocumentosPacienteList
          documents={documents}
          onUpload={handleUploadDocument}
        />
      </div>
      {folderMessage && <p className="message">{folderMessage}</p>}
    </section>
  )
}

export default CarpetaPacientePage
