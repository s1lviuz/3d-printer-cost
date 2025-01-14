'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Calculator, LogOut, Wrench } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-muted shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          3D Print Cost
        </Link>
        <nav>
          {status === 'loading' ? (
            <span>Carregando...</span>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <span>Olá, {session.user?.name || session.user?.email}</span>
              <Link href="/registration">
                <Button size="sm" variant="outline">
                  <Wrench size={16} />
                  Materiais
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="sm">
                  <Calculator size={16} />
                  Calculadora
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
