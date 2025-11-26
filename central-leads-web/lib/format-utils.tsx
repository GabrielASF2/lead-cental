import { ColumnSchema } from './schema-detector'
import { WhatsAppButton } from '@/app/components/WhatsAppButton'
import { Badge } from '@/app/components/Badge'

/**
 * Formata valor da célula baseado no tipo e nome da coluna
 */
export function formatCellValue(value: unknown, column: ColumnSchema) {
  if (value === null || value === undefined) {
    return <span className="text-slate-400 text-xs">-</span>
  }

  // Converte para string para segurança de tipo
  const strValue = String(value)

  // Detecta telefone/WhatsApp
  if (
    column.name.toLowerCase().includes('telefone') ||
    column.name.toLowerCase().includes('whatsapp') ||
    column.name.toLowerCase().includes('phone')
  ) {
    return <WhatsAppButton phone={strValue} />
  }

  // Formata data/timestamp
  if (column.type === 'timestamp' || column.name.toLowerCase().includes('created_at')) {
    return <span className="text-slate-500 whitespace-nowrap">{formatDate(strValue)}</span>
  }

  // Detecta campanha/categoria/status → Badge
  if (
    column.name.toLowerCase().includes('campanha') ||
    column.name.toLowerCase().includes('campaign') ||
    column.name.toLowerCase().includes('categoria') ||
    column.name.toLowerCase().includes('status')
  ) {
    return <Badge variant="blue">{strValue}</Badge>
  }

  // Detecta produto/interesse → Badge cinza
  if (
    column.name.toLowerCase().includes('produto') ||
    column.name.toLowerCase().includes('product') ||
    column.name.toLowerCase().includes('interesse') ||
    column.name.toLowerCase().includes('interest')
  ) {
    return <Badge variant="slate" size="sm">{strValue}</Badge>
  }

  // Email
  if (column.name.toLowerCase().includes('email')) {
    return (
      <a 
        href={`mailto:${strValue}`}
        className="text-blue-600 hover:underline"
      >
        {strValue}
      </a>
    )
  }

  // Detecta nome → destaque
  if (
    column.name.toLowerCase().includes('nome') ||
    column.name.toLowerCase().includes('name')
  ) {
    return <span className="font-medium text-slate-900">{strValue}</span>
  }

  // Texto normal
  return <span className="text-slate-900">{strValue}</span>
}

/**
 * Formata data para padrão brasileiro
 */
function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

