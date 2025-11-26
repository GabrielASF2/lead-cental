import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { detectLeadsSchema } from '@/lib/schema-detector'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Decodifica JWT para validar e pegar user_id
    const decoded = jwt.decode(token) as { sub: string } | null
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const body = await request.json()
    const { supabase_url, supabase_anon_key, table_name = 'leads' } = body

    // Valida URL
    if (!supabase_url.includes('supabase.co')) {
      return NextResponse.json(
        { error: 'URL do Supabase inválida' },
        { status: 400 }
      )
    }

    // ✅ Detecta schema automaticamente
    let schema
    try {
      schema = await detectLeadsSchema(supabase_url, supabase_anon_key, table_name)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return NextResponse.json(
        { error: `Erro ao detectar schema: ${errorMessage}` },
        { status: 400 }
      )
    }

    // Salva no backend com o schema detectado
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const res = await fetch(`${apiUrl}/api/configure-supabase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        supabase_url,
        supabase_anon_key,
        table_name,
        schema, // ← Envia o schema detectado
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json({ error: data.error }, { status: res.status })
    }

    return NextResponse.json({ 
      success: true,
      schema, // Retorna schema para o frontend mostrar
    })
  } catch (error) {
    console.error('Erro:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
