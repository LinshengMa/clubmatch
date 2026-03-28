# Skill: 数据看板与通用组件（Dashboard & Shared Components）

---

## StatusBadge 组件

```jsx
// src/components/StatusBadge.jsx
const STATUS_CONFIG = {
  pending:   { label: '已投递',   bg: 'bg-gray-100',    text: 'text-gray-600',   dot: 'bg-gray-400' },
  reviewing: { label: '审核中',   bg: 'bg-blue-100',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  interview: { label: '面试邀约', bg: 'bg-yellow-100',  text: 'text-yellow-700', dot: 'bg-yellow-500' },
  accepted:  { label: '面试确认', bg: 'bg-green-100',   text: 'text-green-700',  dot: 'bg-green-500' },
  rejected:  { label: '已拒绝',   bg: 'bg-red-100',     text: 'text-red-500',    dot: 'bg-red-400' },
  recruiting:{ label: '招新中',   bg: 'bg-green-100',   text: 'text-green-700',  dot: 'bg-green-500' },
  closed:    { label: '已截止',   bg: 'bg-gray-100',    text: 'text-gray-500',   dot: 'bg-gray-400' },
};

export const StatusBadge = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
};
```

---

## Toast 通知组件

```jsx
// src/components/Toast.jsx
import { useState, useEffect } from 'react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500',
    error:   'bg-red-500',
    info:    'bg-indigo-500',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${styles[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in`}>
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// 使用方式：在 App.jsx 中维护 toast state
// const [toast, setToast] = useState(null);
// showToast = (msg, type) => setToast({ message: msg, type });
// {toast && <Toast {...toast} onClose={() => setToast(null)} />}
```

---

## LoadingDots 组件（AI 加载动画）

```jsx
// src/components/LoadingDots.jsx
export const LoadingDots = ({ text = 'AI 思考中' }) => (
  <div className="flex items-center gap-2 text-gray-400 text-sm">
    <span>{text}</span>
    <span className="flex gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  </div>
);
```

---

## 管理后台 KPI 卡片

```jsx
// src/views/superAdmin/components/KPICard.jsx
export const KPICard = ({ icon, label, value, change, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
      }`}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

// KPI 数据（写死的 Mock 数据）
export const KPI_DATA = [
  { icon: '📝', label: '平台总报名数',  value: '486', change: '23%', trend: 'up' },
  { icon: '🏛️', label: '活跃社团数',    value: '8',   change: '2家', trend: 'up' },
  { icon: '🎯', label: '平均匹配分数',  value: '78分', change: '5.2', trend: 'up' },
  { icon: '👥', label: '新生参与率',    value: '68%', change: '2%',  trend: 'down' },
];
```

---

## 管理后台图表（Recharts）

```jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';

// 报名趋势数据
const TREND_DATA = [
  { date: '9/1', count: 12 }, { date: '9/3', count: 45 },
  { date: '9/5', count: 89 }, { date: '9/7', count: 134 },
  { date: '9/9', count: 178 }, { date: '9/11', count: 234 },
  { date: '9/13', count: 486 },
];

// 折线图
export const TrendChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={TREND_DATA}>
      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
      <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
      <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
      <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2.5}
        dot={{ fill: '#6366F1', r: 4 }} activeDot={{ r: 6 }} />
    </LineChart>
  </ResponsiveContainer>
);

// 类别分布数据
const CATEGORY_DATA = [
  { name: '技术类', value: 156, color: '#3B82F6' },
  { name: '文艺类', value: 98,  color: '#A855F7' },
  { name: '体育类', value: 87,  color: '#22C55E' },
  { name: '公益类', value: 72,  color: '#F97316' },
  { name: '学术类', value: 73,  color: '#14B8A6' },
];

// 饼图（环形）
export const CategoryChart = () => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie data={CATEGORY_DATA} cx="50%" cy="50%"
        innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
        {CATEGORY_DATA.map((entry, i) => (
          <Cell key={i} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip formatter={(v) => [`${v}人`, '报名数']} />
      <Legend formatter={(v) => <span style={{ fontSize: 12, color: '#6B7280' }}>{v}</span>} />
    </PieChart>
  </ResponsiveContainer>
);

// 匹配度分布数据
const MATCH_DATA = [
  { range: '90-100', count: 45 },  { range: '80-90', count: 134 },
  { range: '70-80',  count: 167 }, { range: '60-70', count: 89 },
  { range: '<60',    count: 51 },
];

// 柱状图
export const MatchDistChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={MATCH_DATA} barSize={36}>
      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
      <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
      <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
      <Tooltip formatter={(v) => [`${v}人`, '报名数量']} />
      <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
```

---

## 全局状态管理建议（App.jsx Context）

```jsx
// src/context/AppContext.jsx
import { createContext, useContext, useState } from 'react';
import { mockApplications } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [studentProfile, setStudentProfile] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prev =>
      prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    );
  };

  const addApplication = (clubId, clubName, intro) => {
    const newApp = {
      id: `app_${Date.now()}`,
      studentId: 'stu_current',
      studentName: '我',
      clubId,
      clubName,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      aiIntro: intro,
      studentProfile,
    };
    setApplications(prev => [...prev, newApp]);
  };

  return (
    <AppContext.Provider value={{
      applications, updateApplicationStatus, addApplication,
      studentProfile, setStudentProfile,
      matchResults, setMatchResults,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
```

---

## 社团漏斗图（社团端简版，用纯 CSS 实现）

```jsx
// 不用 Recharts，用横向进度条模拟漏斗
export const ApplicationFunnel = ({ stats }) => {
  const stages = [
    { label: '已投递', count: stats.total,     color: '#E0E7FF' },
    { label: '审核中', count: stats.reviewing,  color: '#C7D2FE' },
    { label: '面试中', count: stats.interview,  color: '#818CF8' },
    { label: '已录取', count: stats.accepted,   color: '#6366F1' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {stages.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-sm text-gray-500 w-14 text-right flex-shrink-0">{s.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
              style={{
                width: `${(s.count / stages[0].count) * 100}%`,
                backgroundColor: s.color,
                minWidth: s.count > 0 ? 40 : 0,
              }}
            >
              <span className="text-xs font-semibold text-indigo-800">{s.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```
