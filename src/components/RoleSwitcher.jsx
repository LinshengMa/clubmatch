const roles = [
  { key: 'student', label: '新生' },
  { key: 'clubAdmin', label: '社团管理员' },
]

export default function RoleSwitcher({ currentRole, onSwitch }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mx-4 mt-3">
      {roles.map((r) => (
        <button
          key={r.key}
          onClick={() => onSwitch(r.key)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            currentRole === r.key
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
