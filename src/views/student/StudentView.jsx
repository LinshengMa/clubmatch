import { useState } from 'react'
import OnboardingQuiz from './OnboardingQuiz'
import SwipeCards from './SwipeCards'
import ClubDetail from './ClubDetail'
import ApplicationDrawer from '../../components/ApplicationDrawer'
import { matchClubs } from '../../services/aiService'
import { clubs } from '../../data/mockData'

export default function StudentView({ applications, onAddApplication }) {
  const [profile, setProfile] = useState(null)
  const [matchResults, setMatchResults] = useState(null)
  const [view, setView] = useState('quiz') // quiz | swipe | swipeAll | detail | applications
  const [detailClub, setDetailClub] = useState(null)
  const [applyClub, setApplyClub] = useState(null) // for detail page apply drawer
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

  // applications view — placeholder for Phase 6
  if (view === 'applications') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
        <p className="text-xl font-bold text-gray-800">我的申请</p>
        <p className="text-sm text-gray-400">
          已提交 {applications.filter((a) => a.studentId === 'stu_current').length} 份申请
        </p>
        <button
          onClick={() => setView('swipe')}
          className="text-indigo-500 text-sm hover:underline mt-2"
        >
          ← 返回推荐
        </button>
      </div>
    )
  }

  return null
}
