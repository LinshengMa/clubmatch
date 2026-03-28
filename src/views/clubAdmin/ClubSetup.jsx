import { useState } from 'react'

const CATEGORY_OPTIONS = ['技术', '��艺', '体育', '公益', '学术']
const VIBE_OPTIONS = [
  { value: 'competitive', label: '竞争激烈型' },
  { value: 'collaborative', label: '团队协作型' },
  { value: 'casual', label: '轻松休闲型' },
  { value: 'creative', label: '创意自由型' },
]

const DEFAULT_CLUB = {
  name: '',
  category: '技术',
  avatar: '💻',
  coverColor: '#4F46E5',
  description: '',
  tags: '',
  memberCount: 30,
  foundedYear: 2020,
  requirements: '',
  weeklyHours: 5,
  vibe: 'collaborative',
  recruitingNow: true,
  headcount: 15,
  deadline: '2024-09-20',
}

export default function ClubSetup({ initialData, onComplete }) {
  const [form, setForm] = useState(initialData || DEFAULT_CLUB)
  const isEdit = !!initialData

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const canSubmit = form.name.trim() && form.description.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    onComplete({
      ...form,
      tags: form.tags.split(/[,，、\s]+/).filter(Boolean),
      requirements: form.requirements.split(/[,，、\s]+/).filter(Boolean),
    })
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-800">
          {isEdit ? '编辑社团信息' : '填写社团信息'}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {isEdit ? '修改后点击保存即可更新' : '首次使用请先完善社团资料，新生端将展示这些信息'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Basic info */}
        <Field label="社团名称 *">
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="例：ACM 算法社"
            className="input-field"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="社团类别">
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="input-field"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="代表 Emoji">
            <input
              value={form.avatar}
              onChange={(e) => update('avatar', e.target.value)}
              className="input-field text-center text-xl"
              maxLength={2}
            />
          </Field>
        </div>

        <Field label="封面颜色">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.coverColor}
              onChange={(e) => update('coverColor', e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <span className="text-xs text-gray-400">{form.coverColor}</span>
          </div>
        </Field>

        <Field label="社团简介 *">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="介绍社团的特色、活动、成就等..."
            rows={3}
            className="input-field resize-none"
          />
        </Field>

        <Field label="标签（逗号分隔）">
          <input
            value={form.tags}
            onChange={(e) => update('tags', e.target.value)}
            placeholder="例：算法, 竞赛, C++, Python"
            className="input-field"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="成员人数">
            <input
              type="number"
              value={form.memberCount}
              onChange={(e) => update('memberCount', parseInt(e.target.value) || 0)}
              className="input-field"
            />
          </Field>
          <Field label="成立年份">
            <input
              type="number"
              value={form.foundedYear}
              onChange={(e) => update('foundedYear', parseInt(e.target.value) || 2020)}
              className="input-field"
            />
          </Field>
        </div>

        <Field label="招新要求（逗号分隔）">
          <input
            value={form.requirements}
            onChange={(e) => update('requirements', e.target.value)}
            placeholder="例：编程基础, 逻辑思维"
            className="input-field"
          />
        </Field>

        <Field label="氛围风格">
          <div className="grid grid-cols-2 gap-2">
            {VIBE_OPTIONS.map((v) => (
              <button
                key={v.value}
                onClick={() => update('vibe', v.value)}
                className={`p-2 rounded-xl border-2 text-sm transition-all ${
                  form.vibe === v.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-100 text-gray-600'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="每周时间(h)">
            <input
              type="number"
              value={form.weeklyHours}
              onChange={(e) => update('weeklyHours', parseInt(e.target.value) || 0)}
              className="input-field"
            />
          </Field>
          <Field label="招新名额">
            <input
              type="number"
              value={form.headcount}
              onChange={(e) => update('headcount', parseInt(e.target.value) || 0)}
              className="input-field"
            />
          </Field>
        </div>

        <Field label="招新截止日期">
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => update('deadline', e.target.value)}
            className="input-field"
          />
        </Field>
      </div>

      {/* Submit */}
      <div className="px-4 pb-6 pt-3">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl text-sm font-medium text-white transition-colors ${
            canSubmit
              ? 'bg-indigo-500 hover:bg-indigo-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isEdit ? '保存修改' : '完成，开始审核申请人'}
        </button>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
        }
        .input-field:focus {
          border-color: #a5b4fc;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      {children}
    </div>
  )
}
