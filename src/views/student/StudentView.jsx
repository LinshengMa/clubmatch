import { useState } from 'react'
import OnboardingQuiz from './OnboardingQuiz'
import SwipeCards from './SwipeCards'
import ClubDetail from './ClubDetail'
import MyApplications from './MyApplications'
import ApplicationDrawer from '../../components/ApplicationDrawer'
import { matchClubs } from '../../services/aiService'
import { clubs } from '../../data/mockData'

export default function StudentView({ applications, onAddApplication, onUpdateApplication }) {
  const [profile, setProfile] = useState(null)
  const [matchResults, setMatchResults] = useState(null)
  const [view, setView] = useState('quiz') // quiz | swipe | swipeAll | detail | applications
  const [detailClub, setDetailClub] = useState(null)
  const [applyClub, setApplyClub] = useState(null)
  const [prevView, setPrevView] = useState('swipe')

  const handleQuizComplete = async (answers) => {
    setProfile(answers)
    const results = await matchClubs(answers, clubs)
    setMatchResults(results)
    setView('swipe')
  }

  const handleApply = (club, intro) => {
    onAddApplication({
      id: `app_${Date.now()}`,
      studentId: 'stu_current',
      studentName: '当前用户',
      clubId: club.id,
      clubName: club.name,
      status: 'pending',
      appliedAt: new Date().toISOString().slice(0, 10),
      aiIntro: intro,
      studentProfile: profile,
    })
  }

  const handleViewDetail = (club) => {
    setDetailClub(club)
    setPrevView(view)
    setView('detail')
  }

  if (view === 'quiz' || !profile) {
    return <OnboardingQuiz onComplete={handleQuizComplete} />
  }

  if (view === 'detail' && detailClub) {
    const matchData = matchResults?.find((m) => m.clubId === detailClub.id) || null
    return (
      <>
        <ClubDetail
          club={detailClub}
          matchData={matchData}
          onBack={() => setView(prevView)}
          onApply={(club) => setApplyClub(club)}
        />
        {applyClub && (
          <ApplicationDrawer
            club={applyClub}
            profile={profile}
            onConfirm={(intro) => {
              handleApply(applyClub, intro)
              setApplyClub(null)
              setView(prevView)
            }}
            onCancel={() => setApplyClub(null)}
          />
        )}
      </>
    )
  }

  if (view === 'swipe' || view === 'swipeAll') {
    return (
      <SwipeCards
        clubs={clubs}
        matchResults={view === 'swipe' ? matchResults : null}
        profile={profile}
        onViewAll={() => setView('swipeAll')}
        onViewApplications={() => setView('applications')}
        onViewDetail={handleViewDetail}
        onApply={handleApply}
      />
    )
  }

  if (view === 'applications') {
    return (
      <MyApplications
        applications={applications}
        onUpdateApplication={onUpdateApplication}
        onBack={() => setView('swipe')}
      />
    )
  }

  return null
}
