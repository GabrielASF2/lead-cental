interface KPICardProps {
  label: string
  value: string | number
  className?: string
}

export function KPICard({ label, value, className = '' }: KPICardProps) {
  return (
    <div
      className={`
        bg-white p-5 rounded-xl border border-slate-200 shadow-sm
        ${className}
      `}
    >
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

