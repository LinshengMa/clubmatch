import { useState } from 'react'
import { Settings } from 'lucide-react'
import ClubSetup from './ClubSetup'
import ApplicantSwipe from './ApplicantSwipe'
import InvitedList from './InvitedList'

export default function ClubAdminView({ applications, onUpdateApplication }) {
  const [clubInfo, setClubInfo] = useState(null)
  const [view, setView] = useState('setup') // setup | swipe | invited

  const handleSetupComplete = (info) => {
    setClubInfo(info)
    setView('swipe')
  }

  // Convert clubInfo back to editable form format
  const getEditableData = () => {
    if (!clubInfo) return null
    return {
      ...clubInfo,
      tags: Array.isArray(clubInfo.tags) ? clubInfo.tags.join(', ') : clubInfo.tags,
      requirements: Array.isArray(clubInfo.requirements) ? clubInfo.requirements.join(', ') : clubInfo.requirements,
    }
  }

  if (view === 'setup' || !clubInfo) {
    return (
      <ClubSetup
        initialData={view === 'setup' && clubInfo ? getEditableData() : null}
        onComplete={handleSetupComplete}
      />
    )
  }

  if (view === 'swipe') {
    return (
      <div className="flex-1 flex flex-col">
        {/* Top bar with edit & invited buttons */}
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setView('setup')}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <Settings size={14} />
            编辑社团信息
          </button>
          <button
            onClick={() => setView('invited')}
            className="text-xs text-indigo-500 hover:underline"
          >
            📋 已邀约名单
          </button>
        </div>
        <ApplicantSwipe
          applications={applications}
          onUpdateApplication={onUpdateApplication}
          onViewInvited={() => setView('invited')}
        />
      </div>
    )
  }

  if (view === 'invited') {
    return (
      <InvitedList
        applications={applications}
        onBack={() => setView('swipe')}
      />
    )
  }

  return null
}
