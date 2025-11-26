import { LeadsTableHeader } from './LeadsTableHeader'
import { LeadsTableRow } from './LeadsTableRow'

export interface Lead {
  id: string
  created_at: string
  name: string
  email?: string | null
  whatsapp: string
  interest: string
  produto?: string | null
  campanha?: string | null
}

interface LeadsTableProps {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-12 text-center text-slate-400">
          Nenhum lead encontrado no banco de dados.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <LeadsTableHeader />
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <LeadsTableRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

