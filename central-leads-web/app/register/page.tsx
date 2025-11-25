'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerAction } from './actions'
import { UserPlus, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Cadastrar Usuário'}
    </button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, null)

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar para Dashboard
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Novo Usuário</h1>
              <p className="text-sm text-slate-500">Adicione um membro ao time</p>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input
                name="name"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email de Acesso</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha Inicial</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Mensagens */}
            {state?.error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {state.error}
              </div>
            )}
            
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  )
}