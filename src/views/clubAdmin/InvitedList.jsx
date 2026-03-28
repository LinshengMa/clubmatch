import { ArrowLeft } from 'lucide-react'

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F97316', '#14B8A6']

const STATUS_CONFIG = {
  interview: { label: '待面试', color: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-500' },
  accepted: { label: '已确认', color: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
}

const SKILL_LABELS = {
  coding: '写代码', design_tools: '设计', writing: '文案写作', speaking: '演讲表达',
  finance: '金融财务', photography: '摄影摄像', athletics: '运动特长', none: '热情满满',
}

export default function InvitedList({ applications, onBack }) {
  const invited = applications.filter((a) => a.status === 'interview' || a.status === 'accepted')

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">已邀约名单</h2>
        <span className="text-xs text-gray-400 ml-auto">{invited.length} 人</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {invited.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">📋</span>
            <p className="text-sm text-gray-400">还没有邀约记录</p>
            <p className="text-xs text-gray-300">右滑申请人发送面试邀约</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {invited.map((app) => {
              const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.interview
              const colorIdx = app.studentName.charCodeAt(0) % AVATAR_COLORS.length
              const profile = app.studentProfile || {}

              return (
                <div key={app.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: AVATAR_COLORS[colorIdx] }}
                  >
                    {app.studentName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{app.studentName}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${config.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(profile.skills || []).slice(0, 3).map((s) => (
                        <span key={s} className="text-xs text-gray-400">
                          {SKILL_LABELS[s] || s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
