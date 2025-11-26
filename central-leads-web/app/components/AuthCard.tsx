import { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export function AuthCard({ children, title, subtitle, className = '' }: AuthCardProps) {
  return (
    <div className={`max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-100 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

