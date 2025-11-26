import Link from 'next/link'
import { Package, UserPlus, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'

interface HeaderProps {
  showNewUserButton?: boolean
}

export function Header({ showNewUserButton = true }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Central de Leads</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {showNewUserButton && (
            <Link
              href="/register"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Link>
          )}

          <form action={logoutAction}>
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

