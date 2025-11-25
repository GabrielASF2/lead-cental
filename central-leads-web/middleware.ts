import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Verifica se tem o cookie do token
  const token = request.cookies.get('token')?.value

  // 2. Define rotas protegidas
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')

  // Se tentar acessar dashboard sem token -> Manda pro Login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se tentar acessar login JÁ tendo token -> Manda pro Dashboard
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configura em quais rotas o middleware roda
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}