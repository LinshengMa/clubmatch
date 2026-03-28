import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const STEPS = [
  {
    key: 'interests',
    title: '你对什么领域感兴趣？',
    subtitle: '可多选，选择所有你感兴趣的方向',
    type: 'multi',
    options: [
      { value: 'coding', label: '编程开发', icon: '💻' },
      { value: 'design', label: '设计创意', icon: '🎨' },
      { value: 'business', label: '商业创业', icon: '📈' },
      { value: 'performance', label: '表演艺术', icon: '🎭' },
      { value: 'sports', label: '体育竞技', icon: '⚽' },
      { value: 'volunteer', label: '公益志愿', icon: '❤️' },
      { value: 'academic', label: '学术研究', icon: '📚' },
      { value: 'media', label: '音乐影像', icon: '🎵' },
    ],
  },
  {
    key: 'skills',
    title: '你有哪些技能背景？',
    subtitle: '可多选，没有也没关系',
    type: 'multi',
    options: [
      { value: 'coding', label: '写代码' },
      { value: 'design_tools', label: 'PS/AE/Figma' },
      { value: 'writing', label: '文案写作' },
      { value: 'speaking', label: '演讲表达' },
      { value: 'finance', label: '金融财务' },
      { value: 'photography', label: '摄影摄像' },
      { value: 'athletics', label: '运动特长' },
      { value: 'none', label: '暂无特别技能但有热情' },
    ],
  },
  {
    key: 'timeAvailable',
    title: '每周能投入多少时间？',
    subtitle: '选择最接近的选项',
    type: 'single',
    options: [
      { value: 2, label: '2小时以内' },
      { value: 4, label: '3-5小时' },
      { value: 8, label: '5-10小时' },
      { value: 12, label: '10小时以上' },
    ],
  },
  {
    key: 'goals',
    title: '你期望从社团获得什么？',
    subtitle: '最多选3个',
    type: 'multi',
    maxSelect: 3,
    options: [
      { value: 'friends', label: '认识志同道合的朋友' },
      { value: 'skills', label: '学到实用技能' },
      { value: 'resume', label: '丰富简历' },
      { value: 'competition', label: '参加比赛拿奖' },
      { value: 'leadership', label: '锻炼领导力' },
      { value: 'fun', label: '单纯好玩放松' },
      { value: 'meaningful', label: '做有意义的事' },
    ],
  },
  {
    key: 'vibe',
    title: '你偏好什么样的氛围？',
    subtitle: '选择最适合你的风格',
    type: 'single',
    options: [
      { value: 'competitive', label: '竞争激烈型' },
      { value: 'collaborative', label: '团队协作型' },
      { value: 'casual', label: '轻松休闲型' },
      { value: 'creative', label: '创意自由型' },
    ],
  },
]

export default function OnboardingQuiz({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    interests: [],
    skills: [],
    timeAvailable: null,
    goals: [],
    vibe: null,
  })
  const [loading, setLoading] = useState(false)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const currentValue = answers[current.key]

  const toggleOption = (value) => {
    if (current.type === 'single') {
      setAnswers((prev) => ({ ...prev, [current.key]: value }))
      return
    }
    // multi select
    setAnswers((prev) => {
      const arr = prev[current.key] || []
      if (arr.includes(value)) {
        return { ...prev, [current.key]: arr.filter((v) => v !== value) }
      }
      if (current.maxSelect && arr.length >= current.maxSelect) return prev
      return { ...prev, [current.key]: [...arr, value] }
    })
  }

  const isSelected = (value) => {
    if (current.type === 'single') return currentValue === value
    return (currentValue || []).includes(value)
  }

  const canProceed = () => {
    if (current.type === 'single') return currentValue !== null
    return (currentValue || []).length > 0
  }

  const handleNext = async () => {
    if (!isLast) {
      setStep((s) => s + 1)
      return
    }
    // last step: show loading then complete
    setLoading(true)
    // 1.5s animation delay
    await new Promise((r) => setTimeout(r, 1500))
    onComplete(answers)
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-600 animate-pulse">
          AI 正在为你匹配最适合的社团...
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">
            {step + 1} / {STEPS.length}
          </span>
          {current.maxSelect && (
            <span className="text-xs text-gray-400">
              已选 {(currentValue || []).length}/{current.maxSelect}
            </span>
          )}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-800">{current.title}</h2>
        <p className="text-xs text-gray-400 mt-1">{current.subtitle}</p>
      </div>

      {/* Options */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2.5">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                isSelected(opt.value)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
              }`}
            >
              {opt.icon && <span className="text-lg">{opt.icon}</span>}
              <span className="text-sm font-medium leading-tight">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="px-4 pb-6 pt-3 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            上一步
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-3 rounded-xl text-sm font-medium text-white transition-colors ${
            canProceed()
              ? 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLast ? '开始匹配 🎯' : '下一步'}
        </button>
      </div>
    </div>
  )
}
