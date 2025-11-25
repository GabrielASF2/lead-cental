'use server'

// Removemos o redirect para não sair da tela de cadastro abruptamente, 
// ou redirecionamos para uma lista de usuários.
// import { redirect } from 'next/navigation' 

export async function registerAction(prevState: { error?: string, success?: boolean } | null, formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    // Nota: Se usar NEXT_PUBLIC_ aqui, certifique-se que essa var existe na Vercel.
    // O ideal para server actions é manter API_URL (server-side only)
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res.ok) {
      return { error: data.error || 'Falha no registro' }
    }

    // --- MUDANÇA AQUI ---
    // Não setamos cookie. Não fazemos login automático.
    // Apenas retornamos sucesso para a UI limpar o formulário e mostrar um "Toast".
    
    return { success: true }

  } catch (err) {
    console.error('Erro ao fazer registro:', err)
    return { error: 'Erro de conexão com o servidor' }
  }
}