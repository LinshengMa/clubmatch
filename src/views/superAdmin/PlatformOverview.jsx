import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import { useToast } from '../../components/Toast'
import { clubs as allClubs } from '../../data/mockData'

// ---------- mock 图表数据 ----------
const trendData = [
  { day: '周一', 报名数: 52 },
  { day: '周二', 报名数: 68 },
  { day: '周三', 报名数: 75 },
  { day: '周四', 报名数: 63 },
  { day: '周五', 报名数: 89 },
  { day: '周六', 报名数: 78 },
  { day: '周日', 报名数: 61 },
]

const categoryData = [
  { name: '技术', value: 140 },
  { name: '文艺', value: 120 },
  { name: '体育', value: 80 },
  { name: '公益', value: 60 },
  { name: '学术', value: 86 },
]

const CATEGORY_COLORS = ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF']

const matchDistData = [
  { range: '0-20', 人数: 5 },
  { range: '21-40', 人数: 12 },
  { range: '41-60', 人数: 38 },
  { range: '61-80', 人数: 95 },
  { range: '81-100', 人数: 56 },
]

// 社团报名数（模拟）
const clubAppCounts = {
  club_acm: 68, club_startup: 52, club_drama: 45, club_dance: 72,
  club_basketball: 58, club_volunteer: 40, club_finance: 63, club_photo: 88,
}

// ---------- KPI 卡片 ----------
const kpis = [
  { label: '平台总报名数', value: '486', change: '↑23%', positive: true, sub: '较上周' },
  { label: '活跃社团数', value: '8', change: '招新中', positive: true, sub: '' },
  { label: '平均匹配分数', value: '78分', change: '↑5.2', positive: true, sub: '' },
  { label: '新生参与率', value: '68%', change: '↓2%', positive: false, sub: '' },
]

export default function PlatformOverview() {
  const showToast = useToast()
  const [clubs, setClubs] = useState(allClubs)

  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const toggleRecruiting = (clubId) => {
    setClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, recruitingNow: !c.recruitingNow } : c))
    )
  }

  return (
    <div className="flex-1 pb-6 bg-gray-50">
      {/* 标题 */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">平台管理后台</h1>
        <p className="text-xs text-gray-400 mt-0.5">{today}</p>
      </div>

      {/* KPI 卡片 */}
      <div className="px-4 grid grid-cols-2 gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{k.value}</p>
            <p className={`text-xs mt-0.5 ${k.positive ? 'text-green-500' : 'text-red-500'}`}>
              {k.change} {k.sub && <span className="text-gray-400">{k.sub}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* 图表行：报名趋势 + 类别分布 */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        {/* 报名趋势折线图 */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs font-medium text-gray-700 mb-2">报名趋势</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={28} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="报名数" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 社团类别分布饼图 */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs font-medium text-gray-700 mb-2">类别分布</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
                paddingAngle={3}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
            {categoryData.map((c, i) => (
              <span key={c.name} className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: CATEGORY_COLORS[i] }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 匹配度分布柱状图 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs font-medium text-gray-700 mb-2">匹配度分布</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={matchDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={28} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="人数" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 社团管理表格 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs font-medium text-gray-700 mb-3">社团管理</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b">
                  <th className="text-left pb-2 font-medium">社团</th>
                  <th className="text-left pb-2 font-medium">类别</th>
                  <th className="text-center pb-2 font-medium">报名</th>
                  <th className="text-center pb-2 font-medium">招新</th>
                  <th className="text-center pb-2 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5">
                      <span className="mr-1">{c.avatar}</span>
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </td>
                    <td className="py-2.5 text-gray-500">{c.category}</td>
                    <td className="py-2.5 text-center text-gray-700">{clubAppCounts[c.id] || 0}</td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={() => toggleRecruiting(c.id)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${
                          c.recruitingNow ? 'bg-indigo-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            c.recruitingNow ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={() => showToast(`${c.name} 详情功能开发中`)}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
