'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction } from './actions'
import Link from 'next/link'
import { KeyRound, Mail, UserPlus } from 'lucide-react'
import { Button, FormField, ErrorMessage, AuthCard } from '@/app/components'

// Componente do Botão para mostrar "Carregando..."
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" fullWidth size="lg" isLoading={pending}>
      Entrar na Plataforma
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, { error: '' })

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <AuthCard
        title="Central de Leads"
        subtitle="Faça login para gerenciar suas campanhas"
      >
        <form action={formAction} className="space-y-6">
          <FormField
            name="email"
            type="email"
            label="Email"
            icon={<Mail className="h-5 w-5" />}
            placeholder="seu@email.com"
            required
          />

          <FormField
            name="password"
            type="password"
            label="Senha"
            icon={<KeyRound className="h-5 w-5" />}
            placeholder="••••••"
            required
          />

          {state?.error && <ErrorMessage message={state.error} />}

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
      </AuthCard>
    </div>
  )
}