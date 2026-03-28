import { useState, useRef } from 'react'
import SwipeCard from '../../components/SwipeCard'
import MatchScoreRing from '../../components/MatchScoreRing'
import { useToast } from '../../components/Toast'

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F97316', '#14B8A6']

const SKILL_LABELS = {
  coding: '写代码', design_tools: '设计', writing: '文案写作', speaking: '演讲表达',
  finance: '金融财务', photography: '摄影摄像', athletics: '运动特长', none: '热情满满',
}

const INTEREST_LABELS = {
  tech: '技术', academic: '学术', art: '文艺', social: '社交',
  sports: '体育', business: '商业', education: '教育',
}

const MOCK_REASONS = [
  '该申请人的技能背景与社团需求高度匹配，且时间投入充足。',
  '兴趣方向契合，具备相关经验，推荐优先考虑。',
  '虽然经验有限，但学习热情高，潜力值得关注。',
  '综合素质不错，团队协作意识强，适合社团氛围。',
]

export default function ApplicantSwipe({ applications, onUpdateApplication, onViewInvited }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drawerApp, setDrawerApp] = useState(null)
  const triggerRef = useRef(null)
  const showToast = useToast()

  // Filter pending/reviewing applications
  const pendingApps = applications.filter((a) => a.status === 'pending' || a.status === 'reviewing')
  const visibleCards = pendingApps.slice(currentIndex, currentIndex + 3)
  const allDone = visibleCards.length === 0

  const handleSwipeRight = (app) => {
    setDrawerApp(app)
  }

  const handleSwipeLeft = () => {
    setCurrentIndex((i) => i + 1)
  }

  const handleConfirmInvite = () => {
    if (drawerApp) {
      onUpdateApplication(drawerApp.id, { status: 'interview' })
      showToast(`已向 ${drawerApp.studentName} 发送面试邀约！`)
      setDrawerApp(null)
      setCurrentIndex((i) => i + 1)
    }
  }

  const handleCancelInvite = () => {
    setDrawerApp(null)
  }

  if (allDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4 px-6">
        <div className="text-6xl mb-2">✅</div>
        <h3 className="text-xl font-semibold text-gray-800">已审核全部申请人</h3>
        <p className="text-sm text-gray-400">可以查看已邀约的名单</p>
        <button
          onClick={onViewInvited}
          className="bg-indigo-500 text-white py-3 px-8 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          查看已邀约名单
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Card stack */}
      <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: 520 }}>
        {visibleCards.map((app, i) => (
          <SwipeCard
            key={app.id}
            isTop={i === 0 && !drawerApp}
            stackIndex={i}
            onSwipeRight={() => handleSwipeRight(app)}
            onSwipeLeft={handleSwipeLeft}
          >
            {({ triggerSwipe }) => {
              if (i === 0) triggerRef.current = triggerSwipe
              return <ApplicantCardContent app={app} index={currentIndex + i} />
            }}
          </SwipeCard>
        ))}
      </div>

      {/* Bottom buttons */}
      {!drawerApp && (
        <div className="flex gap-8 justify-center pb-6">
          <button
            onClick={() => triggerRef.current?.('left')}
            className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-200 text-2xl hover:scale-110 transition-transform flex items-center justify-center"
          >
            ✖
          </button>
          <button
            onClick={() => triggerRef.current?.('right')}
            className="w-14 h-14 rounded-full bg-indigo-500 shadow-md text-2xl hover:scale-110 transition-transform flex items-center justify-center text-white"
          >
            ❤️
          </button>
        </div>
      )}

      {/* Invite confirmation drawer */}
      {drawerApp && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={handleCancelInvite} />
          <div className="relative bg-white rounded-t-2xl p-5 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: AVATAR_COLORS[drawerApp.studentName.charCodeAt(0) % AVATAR_COLORS.length] }}
              >
                {drawerApp.studentName[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">{drawerApp.studentName}</h3>
                <p className="text-xs text-gray-400">申请于 {drawerApp.appliedAt}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              确认向 <strong>{drawerApp.studentName}</strong> 发送面试邀约？
            </p>

            {/* Skills summary */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(drawerApp.studentProfile?.interests || []).map((i) => (
                <span key={i} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {INTEREST_LABELS[i] || i}
                </span>
              ))}
              {(drawerApp.studentProfile?.skills || []).map((s) => (
                <span key={s} className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                  {SKILL_LABELS[s] || s}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelInvite}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                再想想
              </button>
              <button
                onClick={handleConfirmInvite}
                className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                确认发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ApplicantCardContent({ app, index }) {
  const profile = app.studentProfile || {}
  const colorIdx = app.studentName.charCodeAt(0) % AVATAR_COLORS.length
  const mockScore = 70 + ((index * 7 + 13) % 25)

  return (
    <div className="h-[480px] flex flex-col">
      {/* Header with avatar */}
      <div className="bg-gray-50 h-44 flex flex-col items-center justify-center relative shrink-0">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2"
          style={{ backgroundColor: AVATAR_COLORS[colorIdx] }}
        >
          {app.studentName[0]}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{app.studentName}</h3>
        <p className="text-xs text-gray-400">申请于 {app.appliedAt}</p>

        {/* Match score */}
        <div className="absolute top-3 right-3">
          <MatchScoreRing score={mockScore} size={50} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Interests */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">兴趣方向</p>
          <div className="flex flex-wrap gap-1.5">
            {(profile.interests || []).map((i) => (
              <span key={i} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                {INTEREST_LABELS[i] || i}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">技能背景</p>
          <div className="flex flex-wrap gap-1.5">
            {(profile.skills || []).map((s) => (
              <span key={s} className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                {SKILL_LABELS[s] || s}
              </span>
            ))}
            {(!profile.skills || profile.skills.length === 0) && (
              <span className="text-xs text-gray-400">暂无</span>
            )}
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>⏰</span>
          <span>每周可投入 {profile.timeAvailable || '?'} 小时</span>
        </div>

        {/* AI reason */}
        <div className="bg-indigo-50 rounded-xl p-3 mt-auto">
          <p className="text-xs text-indigo-400 mb-1">🤖 AI 推荐理由</p>
          <p className="text-sm text-indigo-700 leading-relaxed">
            {MOCK_REASONS[index % MOCK_REASONS.length]}
          </p>
        </div>
      </div>
    </div>
  )
}
