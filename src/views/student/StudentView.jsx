import { useState } from 'react'
import OnboardingQuiz from './OnboardingQuiz'
import { matchClubs } from '../../services/aiService'
import { clubs } from '../../data/mockData'

export default function StudentView() {
  const [profile, setProfile] = useState(null)
  const [matchResults, setMatchResults] = useState(null)

  const handleQuizComplete = async (answers) => {
    setProfile(answers)
    const results = await matchClubs(answers, clubs)
    setMatchResults(results)
  }

  // Quiz not done yet
  if (!profile) {
    return <OnboardingQuiz onComplete={handleQuizComplete} />
  }

  // Match results ready — placeholder for Phase 4
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
      <p className="text-xl font-bold text-gray-800">匹配完成!</p>
      <p className="text-sm text-gray-400">
        已为你推荐 {matchResults?.length || 0} 个社团
      </p>
      <p className="text-xs text-gray-300">（Tinder 滑动卡片待实现）</p>
    </div>
  )
}
