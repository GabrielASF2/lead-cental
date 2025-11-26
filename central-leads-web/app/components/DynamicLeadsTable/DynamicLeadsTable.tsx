import { ColumnSchema } from '@/lib/schema-detector'
import { DynamicTableHeader } from './DynamicTableHeader'
import { DynamicTableRow } from './DynamicTableRow'

interface DynamicLeadsTableProps {
  schema: ColumnSchema[]
  data: Record<string, any>[]
}

export function DynamicLeadsTable({ schema, data }: DynamicLeadsTableProps) {
  // Filtra colunas que devem aparecer (ignora id, metadados, etc)
  const visibleColumns = schema.filter(col => 
    !['id'].includes(col.name) && 
    col.type !== 'uuid'
  )

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-12 text-center text-slate-400">
          Nenhum lead encontrado.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <DynamicTableHeader columns={visibleColumns} />
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <DynamicTableRow 
                key={row.id || index} 
                row={row} 
                columns={visibleColumns}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

