import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'text-slate-500 hover:text-red-600 hover:bg-red-50',
  dark: 'bg-slate-900 hover:bg-slate-800 text-white'
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5',
  lg: 'px-5 py-3'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        font-semibold rounded-lg transition-all 
        flex items-center justify-center gap-2 
        disabled:opacity-70 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : children}
    </button>
  )
}

