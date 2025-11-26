'use client'

import { useState } from 'react'
import { Header, Button, FormField } from '@/app/components'
import { Settings, Database, CheckCircle2 } from 'lucide-react'
import { ColumnSchema } from '@/lib/schema-detector'

export default function SettingsPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [tableName, setTableName] = useState('leads')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [detectedSchema, setDetectedSchema] = useState<ColumnSchema[] | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setDetectedSchema(null)

    try {
      const res = await fetch('/api/configure-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabase_url: supabaseUrl,
          supabase_anon_key: supabaseKey,
          table_name: tableName,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao configurar')
      }

      // Sucesso!
      if (data.schema) {
        setDetectedSchema(data.schema.columns)
        setSuccess(true)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao configurar Supabase'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showNewUserButton={false} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
            <p className="text-slate-600 text-sm mt-1">
              Configure sua conexão com o Supabase
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-start gap-3 mb-6">
            <Database className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Conectar Supabase
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                O sistema irá detectar automaticamente o schema da sua tabela de leads.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="URL do Projeto Supabase"
              type="url"
              placeholder="https://seu-projeto.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              required
            />

            <FormField
              label="Supabase Anon Key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              required
            />

            <FormField
              label="Nome da Tabela (opcional)"
              type="text"
              placeholder="leads"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                {loading ? 'Detectando Schema...' : 'Salvar Configuração'}
              </Button>
            </div>
          </form>

          {/* Erro */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Sucesso */}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="font-semibold text-green-900">
                  Configuração salva com sucesso!
                </p>
              </div>
              <p className="text-sm text-green-700">
                Acesse o <a href="/dashboard" className="underline font-medium">Dashboard</a> para visualizar seus leads.
              </p>
            </div>
          )}

          {/* Schema Detectado */}
          {detectedSchema && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Schema Detectado ({detectedSchema.length} campos)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {detectedSchema.map((col) => (
                  <div 
                    key={col.name} 
                    className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-blue-100"
                  >
                    <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {col.name}
                    </span>
                    <span className="text-blue-700 text-xs">
                      {col.type}
                    </span>
                    {col.nullable && (
                      <span className="text-blue-500 text-xs">(opcional)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informações de Ajuda */}
        <div className="mt-6 p-6 bg-slate-100 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">
            📋 Como obter as credenciais do Supabase:
          </h3>
          <ol className="space-y-2 text-sm text-slate-700">
            <li>1. Acesse seu projeto no <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
            <li>2. Vá em <strong>Settings → API</strong></li>
            <li>3. Copie a <strong>Project URL</strong> e a <strong>anon public key</strong></li>
            <li>4. Cole aqui e o sistema detectará automaticamente sua tabela de leads!</li>
          </ol>
        </div>
      </main>
    </div>
  )
}

