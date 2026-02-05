import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/forms.css'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import InicioPage from './pages/inicio/InicioPage'
import AgendaLayout from './pages/agenda/AgendaLayout'
import AgendaCalendarioPage from './pages/agenda/AgendaCalendarioPage'
import AgendaResumenPage from './pages/agenda/AgendaResumenPage'
import PacientesLayout from './pages/pacientes/PacientesLayout'
import PacientesGestionPage from './pages/pacientes/PacientesGestionPage'
import HistoriaClinicaPage from './pages/pacientes/HistoriaClinicaPage'
import CarpetaPacientePage from './pages/pacientes/CarpetaPacientePage'
import TurnosLayout from './pages/turnos/TurnosLayout'
import TurnosGestionPage from './pages/turnos/TurnosGestionPage'
import TurnosListadoPage from './pages/turnos/TurnosListadoPage'
import PerfilPage from './pages/perfil/PerfilPage'
import SeguridadPage from './pages/seguridad/SeguridadPage'
import TerminosPage from './pages/terminos/TerminosPage'
import ProfesionalesLayout from './pages/profesionales/ProfesionalesLayout'
import ProfesionalesGestionPage from './pages/profesionales/ProfesionalesGestionPage'
import ProfesionalesPermisosPage from './pages/profesionales/ProfesionalesPermisosPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import AppContext from './contexts/AppContext'

const defaultApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function App() {
  const [apiBase, setApiBase] = useState(
    () => localStorage.getItem('apiBase') || defaultApiBase
  )
  const [inviteToken, setInviteToken] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [authMessage, setAuthMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [patients, setPatients] = useState([])
  const [patientsMessage, setPatientsMessage] = useState('')
  const [patientsLoading, setPatientsLoading] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [turnos, setTurnos] = useState([])
  const [turnosMessage, setTurnosMessage] = useState('')
  const [turnosLoading, setTurnosLoading] = useState(false)
  const [consultorios, setConsultorios] = useState([])
  const [evolutions, setEvolutions] = useState([])
  const [documents, setDocuments] = useState([])
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [usersMessage, setUsersMessage] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [auditLogs, setAuditLogs] = useState([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditMessage, setAuditMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')
  const [selectedConsultorios, setSelectedConsultorios] = useState([])
  const [folderMessage, setFolderMessage] = useState('')
  const [folderLoading, setFolderLoading] = useState(false)
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))

  const isAuthenticated = Boolean(token)

  const apiHeaders = useMemo(() => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }, [token])

  const showToast = (message, type = 'info') => {
    setToastType(type)
    setToastMessage(message)
  }

  useEffect(() => {
    localStorage.setItem('apiBase', apiBase)
  }, [apiBase])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('invite')
    if (token) {
      setInviteToken(token)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setPatients([])
      setTurnos([])
      setConsultorios([])
      setSelectedConsultorios([])
      setSelectedPatientId('')
      setSelectedPatient(null)
      setEvolutions([])
      setDocuments([])
      setReports([])
      return
    }
    void loadPatients()
    void loadConsultorios()
  }, [isAuthenticated])

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    if (!consultorios.length) {
      setSelectedConsultorios([])
      return
    }
    setSelectedConsultorios((prev) => {
      if (prev.length) return prev
      const sorted = [...consultorios].sort((a, b) => a.numero - b.numero)
      const preferido = sorted.find((item) => item.numero === 1) || sorted[0]
      return preferido ? [preferido.id] : []
    })
  }, [consultorios])

  async function handleLogin(event) {
    event.preventDefault()
    setAuthMessage('')
    setLoading(true)

    const email = event.target.email.value.trim()
    const password = event.target.password.value

    try {
      const response = await fetch(`${apiBase}/api/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo iniciar sesión.')
      }
      setToken(data.access)
      setUser(data.user)
      localStorage.setItem('token', data.access)
      localStorage.setItem('user', JSON.stringify(data.user))
      showToast('Sesión iniciada.', 'success')
    } catch (error) {
      setAuthMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function handleUpdateProfile(payload) {
    setProfileMessage('')
    try {
      const response = await fetch(`${apiBase}/api/auth/me/`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo actualizar el perfil.')
      }
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      setProfileMessage('Perfil actualizado.')
      showToast('Perfil actualizado.', 'success')
    } catch (error) {
      setProfileMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleChangePassword(newPassword) {
    setProfileMessage('')
    try {
      const response = await fetch(`${apiBase}/api/auth/change-password/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({ new_password: newPassword }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo actualizar la contraseña.')
      }
      setProfileMessage('Contraseña actualizada.')
      showToast('Contraseña actualizada.', 'success')
    } catch (error) {
      setProfileMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function loadPatients() {
    setPatientsLoading(true)
    setPatientsMessage('')
    try {
      const response = await fetch(`${apiBase}/api/pacientes/`, {
        headers: apiHeaders,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error('No se pudieron cargar pacientes.')
      }
      setPatients(data)
    } catch (error) {
      setPatientsMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setPatientsLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedPatient(null)
      setEvolutions([])
      setDocuments([])
      setReports([])
      return
    }
    const patient = patients.find(
      (item) => String(item.id) === String(selectedPatientId)
    )
    setSelectedPatient(patient || null)
    void loadFolderData(selectedPatientId)
  }, [selectedPatientId, patients])

  async function loadFolderData(patientId) {
    if (!patientId) {
      return
    }
    setFolderLoading(true)
    setFolderMessage('')
    try {
      const [evolutionsResponse, documentsResponse, reportsResponse] =
        await Promise.all([
          fetch(`${apiBase}/api/evoluciones/?paciente=${patientId}`, {
            headers: apiHeaders,
          }),
          fetch(`${apiBase}/api/documentos/?paciente=${patientId}`, {
            headers: apiHeaders,
          }),
          fetch(`${apiBase}/api/informes/?paciente=${patientId}`, {
            headers: apiHeaders,
          }),
        ])
      const evolutionsData = await evolutionsResponse.json()
      const documentsData = await documentsResponse.json()
      const reportsData = await reportsResponse.json()
      if (!evolutionsResponse.ok) {
        throw new Error('No se pudieron cargar evoluciones.')
      }
      if (!documentsResponse.ok) {
        throw new Error('No se pudieron cargar documentos.')
      }
      if (!reportsResponse.ok) {
        throw new Error('No se pudieron cargar informes.')
      }
      setEvolutions(evolutionsData)
      setDocuments(documentsData)
      setReports(reportsData)
    } catch (error) {
      setFolderMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setFolderLoading(false)
    }
  }

  async function handleCreatePatient(event) {
    event.preventDefault()
    setPatientsMessage('')
    const payload = {
      nombre_completo: event.target.nombre_completo.value.trim(),
      dni: event.target.dni.value.trim(),
      email: event.target.email.value.trim() || null,
      telefono: event.target.telefono.value.trim() || null,
      obra_social: event.target.obra_social.value.trim() || null,
      numero_afiliado: event.target.numero_afiliado.value.trim() || null,
      diagnostico: event.target.diagnostico.value.trim() || null,
    }

    try {
      const response = await fetch(`${apiBase}/api/pacientes/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data?.dni?.[0] || data?.detail || 'No se pudo crear el paciente.'
        )
      }
      event.target.reset()
      await loadPatients()
      setPatientsMessage(`Paciente creado: ${data.nombre_completo}`)
      showToast('Paciente creado correctamente.', 'success')
    } catch (error) {
      setPatientsMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function loadConsultorios() {
    try {
      const response = await fetch(`${apiBase}/api/consultorios/`, {
        headers: apiHeaders,
      })
      const data = await response.json()
      if (response.ok) {
        setConsultorios(data)
      } else {
        throw new Error('No se pudieron cargar consultorios.')
      }
    } catch (error) {
      setConsultorios([])
      showToast(error.message || 'No se pudieron cargar consultorios.', 'error')
    }
  }

  async function loadTurnos(dateValue) {
    setTurnosLoading(true)
    setTurnosMessage('')
    const params = new URLSearchParams()
    if (dateValue) {
      params.append('date', dateValue)
    }
    const url = `${apiBase}/api/turnos/${params.toString() ? `?${params}` : ''}`
    try {
      const response = await fetch(url, { headers: apiHeaders })
      const data = await response.json()
      if (!response.ok) {
        throw new Error('No se pudieron cargar los turnos.')
      }
      setTurnos(data)
    } catch (error) {
      setTurnosMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setTurnosLoading(false)
    }
  }

  function getMonday(date) {
    const copy = new Date(date)
    const day = copy.getDay()
    const diff = day === 0 ? -6 : 1 - day
    copy.setDate(copy.getDate() + diff)
    copy.setHours(0, 0, 0, 0)
    return copy
  }

  function formatDateTimeLocal(date) {
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  }

  async function loadTurnosRange(startDate) {
    setTurnosLoading(true)
    setTurnosMessage('')
    const start = new Date(startDate)
    const end = new Date(startDate)
    end.setDate(end.getDate() + 7)
    const params = new URLSearchParams()
    params.append('start', formatDateTimeLocal(start))
    params.append('end', formatDateTimeLocal(end))
    const url = `${apiBase}/api/turnos/?${params.toString()}`
    try {
      const response = await fetch(url, { headers: apiHeaders })
      const data = await response.json()
      if (!response.ok) {
        throw new Error('No se pudieron cargar los turnos.')
      }
      setTurnos(data)
    } catch (error) {
      setTurnosMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setTurnosLoading(false)
    }
  }

  function handleWeekChange(value) {
    if (typeof value === 'number') {
      const next = new Date(weekStart)
      next.setDate(next.getDate() + value)
      setWeekStart(getMonday(next))
      return
    }
    if (value instanceof Date) {
      setWeekStart(getMonday(value))
    }
  }

  async function loadUsers() {
    setUsersLoading(true)
    setUsersMessage('')
    try {
      const response = await fetch(`${apiBase}/api/usuarios/`, {
        headers: apiHeaders,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudieron cargar usuarios.')
      }
      setUsers(data)
    } catch (error) {
      setUsersMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setUsersLoading(false)
    }
  }

  async function loadAuditLogs() {
    setAuditLoading(true)
    setAuditMessage('')
    try {
      const response = await fetch(`${apiBase}/api/audit-logs/`, {
        headers: apiHeaders,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudieron cargar los registros.')
      }
      setAuditLogs(data)
    } catch (error) {
      setAuditMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setAuditLoading(false)
    }
  }

  async function handleToggleEnabled(user) {
    setUsersMessage('')
    try {
      const response = await fetch(`${apiBase}/api/usuarios/${user.id}/`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify({ is_enabled: !user.is_enabled }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo actualizar el usuario.')
      }
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, ...data } : item))
      )
      showToast('Usuario actualizado.', 'success')
    } catch (error) {
      setUsersMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleCreateUser(payload) {
    setUsersMessage('')
    try {
      const response = await fetch(`${apiBase}/api/usuarios/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo crear el usuario.')
      }
      setUsers((prev) => [data, ...prev])
      showToast('Usuario creado.', 'success')
    } catch (error) {
      setUsersMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleUpdateUser(userId, payload) {
    setUsersMessage('')
    try {
      const response = await fetch(`${apiBase}/api/usuarios/${userId}/`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo actualizar el usuario.')
      }
      setUsers((prev) =>
        prev.map((item) => (item.id === userId ? { ...item, ...data } : item))
      )
      showToast('Usuario actualizado.', 'success')
    } catch (error) {
      setUsersMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleSendInvite(payload) {
    setUsersMessage('')
    try {
      const response = await fetch(`${apiBase}/api/invitaciones/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo enviar la invitación.')
      }
      setUsersMessage(`Invitación enviada a ${data.email}.`)
      showToast(`Invitación enviada a ${data.email}.`, 'success')
    } catch (error) {
      setUsersMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleMoveTurno(turnoId, nuevoInicio, nuevoFin, consultorioId) {
    setTurnosMessage('')
    const payload = {
      inicio: nuevoInicio.toISOString(),
      fin: nuevoFin.toISOString(),
      consultorio: consultorioId,
    }
    try {
      const response = await fetch(`${apiBase}/api/turnos/${turnoId}/`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo mover el turno.')
      }
      await loadTurnosRange(weekStart)
      setTurnosMessage('Turno movido correctamente.')
      showToast('Turno movido correctamente.', 'success')
    } catch (error) {
      setTurnosMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleAcceptInvite(token, password) {
    const response = await fetch(`${apiBase}/api/invitaciones/accept/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.detail || 'No se pudo aceptar la invitación.')
    }
    return data
  }

  async function handleCreateTurno(event) {
    event.preventDefault()
    setTurnosMessage('')
    const fecha = event.target.fecha.value
    const inicioHora = event.target.inicio_hora.value
    const finHora = event.target.fin_hora.value
    const inicio = fecha && inicioHora ? `${fecha}T${inicioHora}:00` : ''
    const fin = fecha && finHora ? `${fecha}T${finHora}:00` : ''
    const payload = {
      paciente: event.target.paciente.value,
      consultorio: event.target.consultorio.value,
      inicio,
      fin,
      estado: event.target.estado.value,
    }
    try {
      const response = await fetch(`${apiBase}/api/turnos/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data?.non_field_errors?.[0] || data?.detail || 'No se pudo crear el turno.'
        )
      }
      event.target.reset()
      await loadTurnos()
      setTurnosMessage('Turno creado correctamente.')
      showToast('Turno creado correctamente.', 'success')
    } catch (error) {
      setTurnosMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleCreateEvolution(event) {
    event.preventDefault()
    if (!selectedPatientId) {
      setFolderMessage('Seleccioná un paciente antes de crear evolución.')
      showToast('Seleccioná un paciente antes de crear evolución.', 'error')
      return
    }
    setFolderMessage('')
    const payload = {
      paciente: selectedPatientId,
      texto: event.target.texto.value.trim(),
    }
    try {
      const response = await fetch(`${apiBase}/api/evoluciones/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo guardar la evolución.')
      }
      event.target.reset()
      await loadFolderData(selectedPatientId)
      setFolderMessage('Evolución guardada correctamente.')
      showToast('Evolución guardada correctamente.', 'success')
    } catch (error) {
      setFolderMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleUploadDocument(event) {
    event.preventDefault()
    if (!selectedPatientId) {
      setFolderMessage('Seleccioná un paciente antes de subir documentos.')
      showToast('Seleccioná un paciente antes de subir documentos.', 'error')
      return
    }
    setFolderMessage('')
    const formData = new FormData()
    formData.append('paciente', selectedPatientId)
    formData.append('nombre', event.target.nombre.value.trim())
    if (event.target.archivo.files[0]) {
      formData.append('archivo', event.target.archivo.files[0])
    }
    try {
      const response = await fetch(`${apiBase}/api/documentos/`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo subir el documento.')
      }
      event.target.reset()
      await loadFolderData(selectedPatientId)
      setFolderMessage('Documento subido correctamente.')
      showToast('Documento subido correctamente.', 'success')
    } catch (error) {
      setFolderMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleAttachReportPdf(report, blob) {
    if (!selectedPatientId) {
      setFolderMessage('Seleccioná un paciente antes de adjuntar PDFs.')
      showToast('Seleccioná un paciente antes de adjuntar PDFs.', 'error')
      return
    }
    setFolderMessage('')
    const filename = `${report.titulo || 'informe'}.pdf`
    const file = new File([blob], filename, { type: 'application/pdf' })
    const formData = new FormData()
    formData.append('paciente', selectedPatientId)
    formData.append('nombre', filename)
    formData.append('archivo', file)
    try {
      const response = await fetch(`${apiBase}/api/documentos/`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo adjuntar el PDF.')
      }
      await loadFolderData(selectedPatientId)
      setFolderMessage('PDF adjuntado correctamente.')
      showToast('PDF adjuntado correctamente.', 'success')
    } catch (error) {
      setFolderMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleCreateReport({ titulo, contenidoHtml }) {
    if (!selectedPatientId) {
      setFolderMessage('Seleccioná un paciente antes de crear informes.')
      showToast('Seleccioná un paciente antes de crear informes.', 'error')
      return
    }
    setFolderMessage('')
    const payload = {
      paciente: selectedPatientId,
      titulo,
      contenido_html: contenidoHtml,
    }
    try {
      const response = await fetch(`${apiBase}/api/informes/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo guardar el informe.')
      }
      await loadFolderData(selectedPatientId)
      setFolderMessage('Informe guardado correctamente.')
      showToast('Informe guardado correctamente.', 'success')
    } catch (error) {
      setFolderMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  async function handleUpdateReport(reportId, { titulo, contenidoHtml }) {
    if (!selectedPatientId) {
      setFolderMessage('Seleccioná un paciente antes de editar informes.')
      showToast('Seleccioná un paciente antes de editar informes.', 'error')
      return
    }
    setFolderMessage('')
    const payload = {
      titulo,
      contenido_html: contenidoHtml,
    }
    try {
      const response = await fetch(`${apiBase}/api/informes/${reportId}/`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || 'No se pudo actualizar el informe.')
      }
      await loadFolderData(selectedPatientId)
      setFolderMessage('Informe actualizado correctamente.')
      showToast('Informe actualizado correctamente.', 'success')
    } catch (error) {
      setFolderMessage(error.message)
      showToast(error.message, 'error')
    }
  }

  const appContext = useMemo(
    () => ({
      authToken: token,
      setAuthToken: setToken,
      login: handleLogin,
      logout: handleLogout,
      user,
      showToast,
      patients,
      patientsMessage,
      patientsLoading,
      selectedPatientId,
      setSelectedPatientId,
      selectedPatient,
      setSelectedPatient,
      evolutions,
      documents,
      reports,
      folderMessage,
      folderLoading,
      consultorios,
      selectedConsultorios,
      setSelectedConsultorios,
      turnos,
      turnosMessage,
      turnosLoading,
      users,
      usersMessage,
      usersLoading,
      profileMessage,
      auditLogs,
      auditLoading,
      auditMessage,
      weekStart,
      handleWeekChange,
      loadPatients,
      loadTurnos,
      loadTurnosRange,
      loadUsers,
      loadAuditLogs,
      handleCreatePatient,
      handleCreateEvolution,
      handleUploadDocument,
      handleCreateReport,
      handleUpdateReport,
      handleAttachReportPdf,
      handleCreateTurno,
      handleMoveTurno,
      handleUpdateProfile,
      handleChangePassword,
      handleToggleEnabled,
      handleCreateUser,
      handleUpdateUser,
      handleSendInvite,
    }),
    [
      token,
      user,
      showToast,
      patients,
      patientsMessage,
      patientsLoading,
      selectedPatientId,
      selectedPatient,
      evolutions,
      documents,
      reports,
      folderMessage,
      folderLoading,
      consultorios,
      selectedConsultorios,
      turnos,
      turnosMessage,
      turnosLoading,
      users,
      usersMessage,
      usersLoading,
      profileMessage,
      auditLogs,
      auditLoading,
      auditMessage,
      weekStart,
      handleWeekChange,
      loadPatients,
      loadTurnos,
      loadTurnosRange,
      loadUsers,
      loadAuditLogs,
      handleCreatePatient,
      handleCreateEvolution,
      handleUploadDocument,
      handleCreateReport,
      handleUpdateReport,
      handleAttachReportPdf,
      handleCreateTurno,
      handleMoveTurno,
      handleUpdateProfile,
      handleChangePassword,
      handleToggleEnabled,
      handleCreateUser,
      handleUpdateUser,
      handleSendInvite,
    ]
  )

  return (
    <AppContext.Provider value={appContext}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/inicio" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/inicio" replace />
              ) : (
                <LoginPage
                  onLogin={handleLogin}
                  loading={loading}
                  message={authMessage}
                  inviteToken={inviteToken}
                  onAcceptInvite={handleAcceptInvite}
                  onInviteConsumed={() => setInviteToken('')}
                />
              )
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <MainLayout
                  user={user}
                  onLogout={handleLogout}
                  toastMessage={toastMessage}
                  toastType={toastType}
                />
              }
            >
              <Route path="/inicio" element={<InicioPage />} />

              <Route path="/agenda" element={<AgendaLayout />}>
                <Route index element={<Navigate to="calendario" replace />} />
                <Route path="calendario" element={<AgendaCalendarioPage />} />
                <Route path="resumen" element={<AgendaResumenPage />} />
              </Route>

              <Route path="/pacientes" element={<PacientesLayout />}>
                <Route index element={<Navigate to="gestion" replace />} />
                <Route path="gestion" element={<PacientesGestionPage />} />
                <Route path="historia-clinica" element={<HistoriaClinicaPage />} />
                <Route path="carpeta" element={<CarpetaPacientePage />} />
              </Route>

              <Route path="/turnos" element={<TurnosLayout />}>
                <Route index element={<Navigate to="gestion" replace />} />
                <Route path="gestion" element={<TurnosGestionPage />} />
                <Route path="listado" element={<TurnosListadoPage />} />
              </Route>

              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/seguridad" element={<SeguridadPage />} />
              <Route path="/terminos" element={<TerminosPage />} />

              <Route path="/profesionales" element={<ProfesionalesLayout />}>
                <Route index element={<Navigate to="gestion" replace />} />
                <Route path="gestion" element={<ProfesionalesGestionPage />} />
                <Route path="permisos" element={<ProfesionalesPermisosPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
