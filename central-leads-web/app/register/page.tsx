'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerAction } from './actions'
import { UserPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button, Input, ErrorMessage, Card } from '@/app/components'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" fullWidth variant="dark" isLoading={pending}>
      Cadastrar Usuário
    </Button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, null)

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Dashboard
        </Link>

        <Card padding="lg">
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
            <Input
              name="name"
              label="Nome Completo"
              required
            />

            <Input
              name="email"
              type="email"
              label="Email de Acesso"
              required
            />

            <Input
              name="password"
              type="password"
              label="Senha Inicial"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />

            {state?.error && <ErrorMessage message={state.error} />}

            <SubmitButton />
          </form>
        </Card>
      </div>
    </div>
  )
}