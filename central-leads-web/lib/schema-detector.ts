import { createClient } from '@supabase/supabase-js'

export interface ColumnSchema {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey?: boolean
  label: string
}

export interface TableSchema {
  columns: ColumnSchema[]
  detectedAt: string
}

/**
 * Detecta o schema da tabela do Supabase do cliente
 */
export async function detectLeadsSchema(
  supabaseUrl: string,
  supabaseKey: string,
  tableName: string = 'leads'
): Promise<TableSchema> {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Busca dados da tabela para inferir schema
  const { data: sampleData, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1)

  // Verifica erros de permissão/tabela
  if (error) {
    throw new Error(`Erro ao acessar tabela "${tableName}": ${error.message}`)
  }

  // Verifica se retornou dados ou se RLS está bloqueando
  if (!sampleData || sampleData.length === 0) {
    throw new Error(
      `⚠️ Tabela "${tableName}" existe mas não retornou dados.\n\n` +
      `Possíveis causas:\n` +
      `1. A tabela está realmente vazia (sem registros)\n` +
      `2. RLS (Row Level Security) está bloqueando o acesso\n\n` +
      `✅ Solução: No Supabase, vá em Authentication → Policies e adicione:\n` +
      `   "Enable read access for anon key" na tabela "${tableName}"`
    )
  }

  // 3. Infere schema a partir dos dados
  const columns: ColumnSchema[] = Object.keys(sampleData[0]).map((key) => {
    const value = sampleData[0][key]
    const type = inferType(value)
    
    return {
      name: key,
      type,
      nullable: value === null,
      isPrimaryKey: key === 'id',
      label: formatLabel(key),
    }
  })

  return {
    columns,
    detectedAt: new Date().toISOString(),
  }
}

/**
 * Infere tipo PostgreSQL a partir do valor
 */
function inferType(value: unknown): string {
  if (value === null) return 'text'
  if (typeof value === 'string') {
    // Tenta detectar UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      return 'uuid'
    }
    // Tenta detectar timestamp
    if (!isNaN(Date.parse(value))) {
      return 'timestamp'
    }
    return 'text'
  }
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'numeric'
  if (typeof value === 'boolean') return 'boolean'
  if (value instanceof Date) return 'timestamp'
  return 'text'
}

/**
 * Formata nome da coluna para label amigável
 */
function formatLabel(columnName: string): string {
  return columnName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}