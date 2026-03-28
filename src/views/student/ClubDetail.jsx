import { ArrowLeft, Users, Calendar, Clock, UserPlus } from 'lucide-react'
import MatchScoreRing from '../../components/MatchScoreRing'

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']

export default function ClubDetail({ club, matchData, onBack, onApply }) {
  return (
    <div className="flex-1 flex flex-col pb-20">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-14 left-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Hero */}
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-white font-bold text-xl">{club.name}</h2>
          <p className="text-white/80 text-xs mt-1">{club.description.slice(0, 40)}...</p>
          {club.recruitingNow && (
            <span className="inline-block mt-1.5 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              招新中
            </span>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-2 px-4 py-4 border-b border-gray-100">
        <StatItem icon={<Users size={14} />} value={club.memberCount} label="成员" />
        <StatItem icon={<Calendar size={14} />} value={club.foundedYear} label="成立" />
        <StatItem icon={<Clock size={14} />} value={`${club.weeklyHours}h`} label="每周" />
        <StatItem icon={<UserPlus size={14} />} value="15" label="名额" />
      </div>

      {/* About */}
      <Section title="关于我们">
        <p className="text-sm text-gray-600 leading-relaxed">{club.description}</p>
      </Section>

      {/* Requirements */}
      <Section title="我们在招">
        <div className="flex flex-wrap gap-2">
          {club.requirements.map((r, i) => (
            <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-full">
              {r}
            </span>
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section title="成员说">
        <div className="flex flex-col gap-3">
          {club.reviews.map((review, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {review.author[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-800">{review.author}</span>
                  <span className="text-xs text-gray-300">{review.year}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Activities */}
      <Section title="近期活动">
        <div className="flex flex-col gap-3">
          {club.activities.map((act, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-800">{act.title}</h4>
                <span className="text-xs text-gray-400">{act.date}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{act.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Fixed bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={() => onApply(club)}
          className="w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          ❤️ 我感兴趣
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="px-4 py-3 border-b border-gray-50">
      <h3 className="text-sm font-bold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  )
}

function StatItem({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}
