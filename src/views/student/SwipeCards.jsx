import { useState, useRef } from 'react'
import SwipeCard from '../../components/SwipeCard'
import MatchScoreRing from '../../components/MatchScoreRing'
import ApplicationDrawer from '../../components/ApplicationDrawer'

export default function SwipeCards({
  clubs,
  matchResults,
  profile,
  onViewAll,
  onViewApplications,
  onViewDetail,
  onApply,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drawerClub, setDrawerClub] = useState(null)
  const triggerRef = useRef(null)

  // Merge club data with match results
  const sortedClubs = matchResults
    ? matchResults
        .sort((a, b) => b.matchScore - a.matchScore)
        .map((m) => ({
          ...clubs.find((c) => c.id === m.clubId),
          matchData: m,
        }))
        .filter((c) => c.id)
    : clubs.map((c) => ({ ...c, matchData: null }))

  const visibleCards = sortedClubs.slice(currentIndex, currentIndex + 3)
  const allDone = visibleCards.length === 0

  const handleSwipeRight = (club) => {
    setDrawerClub(club)
  }

  const handleSwipeLeft = () => {
    setCurrentIndex((i) => i + 1)
  }

  const handleConfirmApply = (intro) => {
    if (drawerClub) {
      onApply(drawerClub, intro)
      setDrawerClub(null)
      setCurrentIndex((i) => i + 1)
    }
  }

  const handleCancelApply = () => {
    // Card bounces back — don't advance index
    setDrawerClub(null)
  }

  if (allDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4 px-6">
        <div className="text-6xl mb-2">🎉</div>
        <h3 className="text-xl font-semibold text-gray-800">
          你已浏览全部 AI 推荐社团
        </h3>
        <p className="text-sm text-gray-400">还想探索更多？</p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onViewAll}
            className="bg-indigo-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            查看更多社团
          </button>
          <button
            onClick={onViewApplications}
            className="border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            查看我的申请
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Card stack */}
      <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: 520 }}>
        {visibleCards.map((club, i) => (
          <SwipeCard
            key={club.id}
            isTop={i === 0 && !drawerClub}
            stackIndex={i}
            onSwipeRight={() => handleSwipeRight(club)}
            onSwipeLeft={handleSwipeLeft}
          >
            {({ triggerSwipe }) => {
              if (i === 0) triggerRef.current = triggerSwipe
              return (
                <ClubCardContent
                  club={club}
                  matchData={club.matchData}
                  onDetail={() => onViewDetail(club)}
                />
              )
            }}
          </SwipeCard>
        ))}
      </div>

      {/* Bottom buttons */}
      {!drawerClub && (
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

      {/* Application drawer */}
      {drawerClub && (
        <ApplicationDrawer
          club={drawerClub}
          profile={profile}
          onConfirm={handleConfirmApply}
          onCancel={handleCancelApply}
        />
      )}
    </div>
  )
}

// ==================== Card Content ====================

function ClubCardContent({ club, matchData, onDetail }) {
  return (
    <div className="h-[480px] flex flex-col">
      {/* Cover */}
      <div
        className="h-48 flex items-center justify-center relative shrink-0"
        style={{ backgroundColor: club.coverColor }}
      >
        <span className="text-7xl">{club.avatar}</span>
        {matchData && (
          <div className="absolute top-3 right-3">
            <MatchScoreRing score={matchData.matchScore} size={56} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <h3 className="text-white font-bold text-lg">{club.name}</h3>
          <span className="text-white/80 text-xs">{club.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {matchData && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {matchData.reason}
          </p>
        )}

        {matchData?.highlights && (
          <div className="flex flex-wrap gap-1.5">
            {matchData.highlights.map((h, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full"
              >
                ✓ {h}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3 text-xs text-gray-500 mt-auto">
          <span>👥 {club.memberCount}人</span>
          <span>⏰ 每周约{club.weeklyHours}小时</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDetail()
          }}
          className="text-indigo-500 text-sm text-center hover:underline"
        >
          查看详情 →
        </button>
      </div>
    </div>
  )
}
