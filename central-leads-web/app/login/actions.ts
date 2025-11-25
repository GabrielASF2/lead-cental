'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  // 1. Chama a API Go (Server to Server)
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store', // Não cachear login
    })

    const data = await res.json()

    if (!res.ok) {
      return { error: data.error || 'Falha na autenticação' }
    }

    // 2. Salva o Token no Cookie (Segurança Máxima)
    // O cookie é HttpOnly, o JS do navegador não vê, mas ele vai em toda requisição
    const cookieStore = await cookies()
    cookieStore.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    })

    // Opcional: Salvar dados do usuário num cookie não-httpOnly se precisar exibir o nome na tela
    // cookies().set('user_name', data.user.name, { ... })

  } catch (err) {
    console.error('Erro ao fazer login:', err)
    return { error: 'Erro de conexão com o servidor' }
  }

  // 3. Redireciona para o Dashboard
  redirect('/dashboard')
}

// Adicione isso no final do arquivo app/login/actions.ts

export async function logoutAction() {
    const cookieStore = await cookies()
    
    // Destroi o cookie do token
    cookieStore.delete('token')
    
    // Manda o usuário de volta pro login
    redirect('/login')
  }