import { ArrowLeft } from 'lucide-react'
import { useToast } from '../../components/Toast'

const STATUS_CONFIG = {
  pending: { label: '已投递', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', hint: '等待社团审核中' },
  reviewing: { label: '审核中', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500', hint: '社团正在查看你的资料' },
  interview: { label: '面试邀约', color: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-500', hint: '' },
  accepted: { label: '面试确认', color: 'bg-green-50 text-green-600', dot: 'bg-green-500', hint: '恭喜！请按时参加面试' },
  rejected: { label: '已拒绝', color: 'bg-red-50 text-red-500', dot: 'bg-red-400', hint: '可以尝试申请其他社团' },
}

export default function MyApplications({ applications, onUpdateApplication, onBack }) {
  const showToast = useToast()
  const myApps = applications.filter((a) => a.studentId === 'stu_current')

  const handleAccept = (app) => {
    onUpdateApplication(app.id, { status: 'accepted' })
    showToast(`已确认 ${app.clubName} 的面试邀约！`)
  }

  const handleReject = (app) => {
    onUpdateApplication(app.id, { status: 'rejected' })
    showToast(`已婉拒 ${app.clubName} 的面试邀约`, 'error')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">我的申请</h2>
        <span className="text-xs text-gray-400 ml-auto">{myApps.length} 条记录</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {myApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">📋</span>
            <p className="text-sm text-gray-400">还没有申请记录</p>
            <p className="text-xs text-gray-300">去滑动匹配页面报名社团吧</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myApps.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onAccept={() => handleAccept(app)}
                onReject={() => handleReject(app)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationCard({ app, onAccept, onReject }) {
  const config = STATUS_CONFIG[app.status]
  const isInterview = app.status === 'interview'

  return (
    <div className={`rounded-xl border p-4 ${isInterview ? 'border-yellow-300 bg-yellow-50/50' : 'border-gray-100 bg-white'}`}>
      <div className="flex items-start gap-3">
        {/* Club avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
          {getClubEmoji(app.clubName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-800 truncate">{app.clubName}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${config.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">申请于 {app.appliedAt}</p>

          {/* Interview invitation */}
          {isInterview ? (
            <div className="mt-3">
              <p className="text-sm text-yellow-700 font-medium mb-2">
                🎉 恭喜！{app.clubName} 向你发出了面试邀约
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onAccept}
                  className="flex-1 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  ✅ 接受面试
                </button>
                <button
                  onClick={onReject}
                  className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ❌ 婉拒
                </button>
              </div>
            </div>
          ) : (
            config.hint && (
              <p className="text-xs text-gray-400 mt-1">{config.hint}</p>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const CLUB_EMOJI_MAP = {
  'ACM': '💻', '算法': '💻',
  '创业': '🚀',
  '话剧': '🎭',
  '街舞': '💃',
  '篮球': '🏀',
  '公益': '❤️', '支教': '❤️',
  '金融': '📊', '建模': '📊',
  '摄影': '📷',
}

function getClubEmoji(name) {
  for (const [key, emoji] of Object.entries(CLUB_EMOJI_MAP)) {
    if (name.includes(key)) return emoji
  }
  return '🏫'
}
