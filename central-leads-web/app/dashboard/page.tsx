import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header, KPICard, DynamicLeadsTable } from '@/app/components'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { ColumnSchema } from '@/lib/schema-detector'

interface SupabaseConfig {
  supabase_url: string
  supabase_anon_key: string
  leads_table_name: string
  leads_schema: {
    columns: ColumnSchema[]
  }
}

async function getSupabaseConfig(token: string): Promise<SupabaseConfig | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const res = await fetch(`${apiUrl}/api/user/supabase-config`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  // Busca config do Supabase do usuário
  const config = await getSupabaseConfig(token.value)

  // Se não configurou, mostra tela para configurar
  if (!config || !config.supabase_url) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header showNewUserButton={false} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Settings className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Configure seu Supabase
          </h2>
          <p className="text-slate-600 mb-8">
            Conecte seu projeto Supabase e deixe o sistema detectar automaticamente 
            o schema da sua tabela de leads.
          </p>
          <Link
            href="/settings"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Configurar Agora
          </Link>
        </div>
      </div>
    )
  }

  // Cria cliente Supabase dinâmico com as credenciais do usuário
  const supabase = createClient(config.supabase_url, config.supabase_anon_key)

  // Busca dados da tabela (nome dinâmico!)
  const { data: leads, error } = await supabase
    .from(config.leads_table_name)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error("Erro Supabase:", error)
    return (
      <div className="min-h-screen bg-slate-50">
        <Header showNewUserButton={false} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-red-600 mb-4 text-lg">
            ❌ Erro ao carregar dados: {error.message}
          </p>
          <p className="text-slate-600 mb-6">
            Verifique se suas credenciais do Supabase estão corretas.
          </p>
          <Link 
            href="/settings" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verificar Configuração
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showNewUserButton={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Seus Leads</h2>
            <p className="text-sm text-slate-500 mt-1">
              Tabela: <span className="font-mono text-slate-700">{config.leads_table_name}</span> • 
              {config.leads_schema.columns.length} campos detectados
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KPICard label="Total de Leads" value={leads?.length || 0} />
          <KPICard 
            label="Campos na Tabela" 
            value={config.leads_schema.columns.length} 
          />
          <KPICard 
            label="Schema Detectado" 
            value="✓" 
          />
        </div>

        {/* ✅ Tabela DINÂMICA que se adapta ao schema do cliente */}
        <DynamicLeadsTable 
          schema={config.leads_schema.columns}
          data={leads || []}
        />
      </main>
    </div>
  )
}
