import { useState, useEffect } from 'react'
import RoleSwitcher from './components/RoleSwitcher'
import StudentView from './views/student/StudentView'
import ClubAdminView from './views/clubAdmin/ClubAdminView'
import SuperAdminView from './views/superAdmin/SuperAdminView'

function App() {
  const [role, setRole] = useState('student')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('role') === 'superadmin') {
      setRole('superadmin')
    }
  }, [])

  const isSuperAdmin = role === 'superadmin'

  return (
    <div className="min-h-screen bg-gray-300 flex items-start justify-center">
      <div
        className="relative bg-white w-full overflow-x-hidden flex flex-col"
        style={{
          maxWidth: 390,
          minHeight: '100dvh',
        }}
      >
        {!isSuperAdmin && (
          <RoleSwitcher currentRole={role} onSwitch={setRole} />
        )}

        {role === 'student' && <StudentView />}
        {role === 'clubAdmin' && <ClubAdminView />}
        {isSuperAdmin && <SuperAdminView />}
      </div>
    </div>
  )
}

export default App
