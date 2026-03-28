import { clubs } from '../../data/mockData'

export default function MyClubs({ applications }) {
  const joinedApps = applications.filter(
    (a) => a.studentId === 'stu_current' && a.status === 'accepted'
  )

  const joinedClubs = joinedApps
    .map((app) => {
      const club = clubs.find((c) => c.id === app.clubId)
      return club ? { ...club, joinedAt: app.appliedAt } : null
    })
    .filter(Boolean)

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">我的社团</h2>
        <span className="text-xs text-gray-400 ml-auto">{joinedClubs.length} 个社团</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {joinedClubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">🏠</span>
            <p className="text-sm text-gray-400">还没有加入任何社团</p>
            <p className="text-xs text-gray-300">通过面试后即可在这里看到你的社团</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {joinedClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClubCard({ club }) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
      {/* Mini cover */}
      <div
        className="h-20 flex items-center gap-3 px-4"
        style={{ backgroundColor: club.coverColor }}
      >
        <span className="text-4xl">{club.avatar}</span>
        <div>
          <h4 className="text-white font-bold text-sm">{club.name}</h4>
          <span className="text-white/70 text-xs">{club.category}</span>
        </div>
        <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          已加入
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {club.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span>👥 {club.memberCount}人</span>
          <span>⏰ 每周约{club.weeklyHours}小时</span>
          <span>🎯 {club.vibe === 'competitive' ? '竞争型' : club.vibe === 'collaborative' ? '协作型' : club.vibe === 'casual' ? '休闲型' : '创意型'}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{club.description}</p>
      </div>
    </div>
  )
}
