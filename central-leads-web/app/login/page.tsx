'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction } from './actions'
import Link from 'next/link'
import { KeyRound, Mail, Loader2, UserPlus } from 'lucide-react'

// Componente do Botão para mostrar "Carregando..."
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Entrar na Plataforma'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, { error: '' })

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Central de Leads</h1>
          <p className="text-slate-500 text-sm mt-1">Faça login para gerenciar suas campanhas</p>
        </div>

        <form action={formAction} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <UserPlus className="h-4 w-4" />
            Criar Novo Usuário
          </Link>
        </div>

      </div>
    </div>
  )
}