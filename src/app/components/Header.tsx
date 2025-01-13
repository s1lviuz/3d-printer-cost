'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm">
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
                  Materiais
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="sm">
                  Calculadora
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>Sair</Button>
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
