'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Calculator, LogOut, Wrench } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

export function Header() {
  const { data: session, status } = useSession()
  const isMobile = useIsMobile()

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
              {!isMobile && (
                <span>Olá, {session.user?.name || session.user?.email}</span>
              )}
              <Link href="/registration">
                <Button size="sm" variant="outline">
                  <Wrench size={16} />
                  {isMobile ? '' : 'Materiais'}
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="sm">
                  <Calculator size={16} />
                  {isMobile ? '' : 'Calculadora'}
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut size={16} />
                {isMobile ? '' : 'Sair'}
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
