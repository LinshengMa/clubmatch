import { useState, useEffect } from 'react'
import RoleSwitcher from './components/RoleSwitcher'
import { ToastProvider } from './components/Toast'
import ChatBot from './components/ChatBot'
import StudentView from './views/student/StudentView'
import ClubAdminView from './views/clubAdmin/ClubAdminView'
import SuperAdminView from './views/superAdmin/SuperAdminView'
import MyClubs from './views/student/MyClubs'
import { applications as initialApplications } from './data/mockData'

function App() {
  const [role, setRole] = useState('student')
  const [applications, setApplications] = useState(initialApplications)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('role') === 'superadmin') {
      setRole('superadmin')
    }
  }, [])

  const isSuperAdmin = role === 'superadmin'

  const addApplication = (app) => {
    setApplications((prev) => [...prev, app])
  }

  const updateApplication = (id, updates) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    )
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-start justify-center">
      <div
        className="relative bg-white w-full overflow-x-hidden flex flex-col"
        style={{
          maxWidth: 390,
          minHeight: '100dvh',
        }}
      >
        <ToastProvider>
          {!isSuperAdmin && (
            <RoleSwitcher currentRole={role} onSwitch={setRole} />
          )}

          {role === 'student' && (
            <StudentView
              applications={applications}
              onAddApplication={addApplication}
              onUpdateApplication={updateApplication}
            />
          )}
          {role === 'clubAdmin' && (
            <ClubAdminView
              applications={applications}
              onUpdateApplication={updateApplication}
            />
          )}
          {role === 'myClubs' && (
            <MyClubs applications={applications} onBack={() => setRole('student')} />
          )}
          {isSuperAdmin && <SuperAdminView />}

          {role === 'student' && <ChatBot />}
        </ToastProvider>
      </div>
    </div>
  )
}

export default App
