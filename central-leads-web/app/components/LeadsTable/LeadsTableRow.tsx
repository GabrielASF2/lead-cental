import { Mail } from 'lucide-react'
import { Lead } from './LeadsTable'
import { WhatsAppButton } from '../WhatsAppButton'
import { Badge } from '../Badge'

interface LeadsTableRowProps {
  lead: Lead
}

// Formata data para padrão brasileiro
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function LeadsTableRow({ lead }: LeadsTableRowProps) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      {/* Data */}
      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
        {formatDate(lead.created_at)}
      </td>

      {/* Nome + Email (se tiver) */}
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900">{lead.name}</div>
        {lead.email && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <Mail className="h-3 w-3" /> {lead.email}
          </div>
        )}
      </td>

      {/* WhatsApp (Link Clicável) */}
      <td className="px-6 py-4">
        <WhatsAppButton phone={lead.whatsapp} />
      </td>

      {/* Interesse e Produto */}
      <td className="px-6 py-4">
        <div className="text-slate-900 font-medium">{lead.interest}</div>
        {lead.produto && (
          <Badge variant="slate" size="sm" className="mt-1">
            {lead.produto}
          </Badge>
        )}
      </td>

      {/* Campanha */}
      <td className="px-6 py-4">
        {lead.campanha ? (
          <Badge variant="blue">{lead.campanha}</Badge>
        ) : (
          <span className="text-slate-400 text-xs">-</span>
        )}
      </td>
    </tr>
  )
}

