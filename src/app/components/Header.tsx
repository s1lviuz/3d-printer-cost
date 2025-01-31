'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Calculator, LogOut, Moon, Sun, SunMoon, User2, Wrench } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCookies } from 'next-client-cookies';
import { setUserLocale } from '@/services/locale'

export function Menu({ children }: { children: React.ReactNode }) {
  const cookies = useCookies();
  const language = cookies.get('NEXT_LOCALE') || 'Sistema'

  const { theme, setTheme } = useTheme()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer'>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
          >
            Perfil
            <DropdownMenuShortcut>
              <User2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/parameters')}
          >
            Parametros
            <DropdownMenuShortcut>
              <Wrench size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Tema: {theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro'}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme('light')}
              >
                Claro
                <DropdownMenuShortcut>
                  <Sun size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
              >
                Escuro
                <DropdownMenuShortcut>
                  <Moon size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
              >
                Sistema
                <DropdownMenuShortcut>
                  <SunMoon size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Idioma: {language === 'en' ? 'en-US' : 'pt-BR'}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => setUserLocale('en')}
                >
                  en-US
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setUserLocale('pt-BR')}
                >
                  pt-BR
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
        >
          Sair
          <DropdownMenuShortcut>
            <LogOut size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
              <Link href="/calculator">
                <Button size="sm">
                  <Calculator size={16} />
                  {isMobile ? '' : 'Calculadora'}
                </Button>
              </Link>
              <Menu>
                <Avatar>
                  <AvatarImage src={session.user?.image ?? ''} alt="Avatar" />
                  <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Menu>
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
