import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Zap, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Central de Leads</h1>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Gerencie seus leads de forma{' '}
            <span className="text-blue-600">simples e eficiente</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Centralize todos os seus leads de campanhas, WhatsApp e formulários 
            em um só lugar. Tenha o controle total do seu funil de vendas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Acessar Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all border-2 border-slate-200"
            >
              Criar Conta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Gestão Centralizada
            </h3>
            <p className="text-slate-600">
              Todos os seus leads em um único lugar, organizados por campanha, 
              produto e data de entrada.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Integração WhatsApp
            </h3>
            <p className="text-slate-600">
              Contato direto com seus leads através de links integrados 
              do WhatsApp para resposta rápida.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Seguro e Confiável
            </h3>
            <p className="text-slate-600">
              Seus dados protegidos com autenticação segura e backup 
              automático em nuvem.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 bg-blue-600 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Comece a organizar seus leads agora
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100">Gratuito</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-blue-100">Leads Ilimitados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Acesso Total</div>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg"
          >
            Criar Minha Conta Grátis
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2025 Central de Leads. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="hover:text-blue-600 transition-colors">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
