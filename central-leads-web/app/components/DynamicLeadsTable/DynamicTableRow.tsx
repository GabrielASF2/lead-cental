import { ColumnSchema } from '@/lib/schema-detector'
import { formatCellValue } from '@/lib/format-utils'

interface DynamicTableRowProps {
  row: Record<string, any>
  columns: ColumnSchema[]
}

export function DynamicTableRow({ row, columns }: DynamicTableRowProps) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      {columns.map((col) => (
        <td key={col.name} className="px-6 py-4">
          {formatCellValue(row[col.name], col)}
        </td>
      ))}
    </tr>
  )
}

