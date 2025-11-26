import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header, KPICard, LeadsTable, Lead } from '@/app/components'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  // Busca os leads com as colunas reais
  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error("Erro Supabase:", error)
    return <div className="p-8 text-red-600">Erro ao carregar leads.</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showNewUserButton={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Simples */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KPICard label="Total de Leads" value={leads?.length || 0} />
        </div>

        {/* Tabela de Leads */}
        <LeadsTable leads={(leads as Lead[]) || []} />
      </main>
    </div>
  )
}