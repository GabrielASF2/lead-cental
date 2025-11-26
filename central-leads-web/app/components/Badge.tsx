import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'blue' | 'green' | 'slate' | 'gray'
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200'
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs'
}

export function Badge({
  children,
  variant = 'blue',
  size = 'md',
  className = ''
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md font-medium border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

