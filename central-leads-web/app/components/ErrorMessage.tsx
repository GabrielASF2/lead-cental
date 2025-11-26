interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div
      className={`
        p-3 bg-red-50 text-red-600 text-sm rounded-lg 
        border border-red-100 text-center
        ${className}
      `}
    >
      {message}
    </div>
  )
}

