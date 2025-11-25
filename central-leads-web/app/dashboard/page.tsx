import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogOut, MessageCircle, Mail, Package } from 'lucide-react'
import { logoutAction } from '@/app/login/actions' // Vamos criar isso abaixo rapidinho

// Tipo do Lead
interface Lead {
  id: string
  created_at: string
  name: string
  email?: string | null
  whatsapp: string
  interest: string
  produto?: string | null
  campanha?: string | null
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

// Limpa o telefone para usar no link (remove ( ) - e espaços)
const cleanPhone = (phone: string) => {
  return phone.replace(/\D/g, '')
}

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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Central de Leads</h1>
          </div>
          
          <form action={logoutAction}>
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Simples */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">Total de Leads</p>
            <p className="text-2xl font-bold text-slate-800">{leads?.length || 0}</p>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Contato (WhatsApp)</th>
                  <th className="px-6 py-4">Interesse / Produto</th>
                  <th className="px-6 py-4">Campanha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads?.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                    
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
                      <a 
                        href={`https://wa.me/55${cleanPhone(lead.whatsapp)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:bg-green-100 transition-colors border border-green-200"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {lead.whatsapp}
                      </a>
                    </td>

                    {/* Interesse e Produto */}
                    <td className="px-6 py-4">
                       <div className="text-slate-900 font-medium">{lead.interest}</div>
                       {lead.produto && (
                         <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                           {lead.produto}
                         </span>
                       )}
                    </td>

                    {/* Campanha */}
                    <td className="px-6 py-4">
                      {lead.campanha ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {lead.campanha}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!leads || leads.length === 0) && (
               <div className="p-12 text-center text-slate-400">
                 Nenhum lead encontrado no banco de dados.
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}