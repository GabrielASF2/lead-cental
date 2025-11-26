import { ColumnSchema } from '@/lib/schema-detector'

interface DynamicTableHeaderProps {
  columns: ColumnSchema[]
}

export function DynamicTableHeader({ columns }: DynamicTableHeaderProps) {
  return (
    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
      <tr>
        {columns.map((col) => (
          <th key={col.name} className="px-6 py-4">
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

