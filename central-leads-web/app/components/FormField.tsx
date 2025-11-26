import { InputHTMLAttributes, ReactNode } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  error?: string
}

export function FormField({
  label,
  icon,
  error,
  className = '',
  ...props
}: FormFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 h-5 w-5 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 
            border border-slate-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            outline-none transition-all
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

