import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Breadcrumbs from '../components/common/Breadcrumbs'
import '../styles/layouts.css'

function MainLayout({ user, onLogout, toastMessage, toastType }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isBrowser = typeof window !== 'undefined'
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    isBrowser ? window.innerWidth > 980 : true
  )
  const [isMobile, setIsMobile] = useState(() =>
    isBrowser ? window.innerWidth <= 980 : false
  )
  const prevMobileRef = useRef(isMobile)

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 980
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else if (prevMobileRef.current) {
        setIsSidebarOpen(true)
      }
      prevMobileRef.current = mobile
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="app-shell">
      {toastMessage && (
        <div className={`toast toast-${toastType}`}>{toastMessage}</div>
      )}
      <Header
        user={user}
        onToggleMenu={() => setIsSidebarOpen((prev) => !prev)}
        onLogout={() => {
          onLogout()
          navigate('/login')
        }}
      />
      <Breadcrumbs />
      <div className={`layout-main ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          isAdmin={user?.role === 'DUENA'}
          onNavigate={() => {
            if (isMobile) {
              setIsSidebarOpen(false)
            }
          }}
        />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}

export default MainLayout
