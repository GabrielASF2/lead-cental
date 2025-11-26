import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phone: string
  displayPhone?: string
  className?: string
}

// Limpa o telefone para usar no link (remove ( ) - e espaços)
const cleanPhone = (phone: string) => {
  return phone.replace(/\D/g, '')
}

export function WhatsAppButton({
  phone,
  displayPhone,
  className = ''
}: WhatsAppButtonProps) {
  const cleanedPhone = cleanPhone(phone)
  const display = displayPhone || phone

  return (
    <a
      href={`https://wa.me/55${cleanedPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 
        bg-green-50 text-green-700 rounded-full text-xs font-medium 
        hover:bg-green-100 transition-colors border border-green-200
        ${className}
      `}
    >
      <MessageCircle className="h-3.5 w-3.5" />
      {display}
    </a>
  )
}

