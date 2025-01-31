'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { ArrowBigDown, Calculator, LogOut, Moon, Sun, SunMoon, User2, Wrench } from 'lucide-react'
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
import { useTranslations } from 'next-intl';

export function Menu({ children }: { children: React.ReactNode }) {
  const cookies = useCookies();
  const language = cookies.get('NEXT_LOCALE') || 'Sistema'

  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer'>
        <div className="flex items-center space-x-2 border border-muted-foreground rounded-full pr-2 hover:bg-muted-foreground hover:text-muted-background">
          {children}
          <ArrowBigDown size={18} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {t('commom.account')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
          >
            {t('commom.profile')}
            <DropdownMenuShortcut>
              <User2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/parameters')}
          >
            {t('commom.parameters')}
            <DropdownMenuShortcut>
              <Wrench size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Tema: {theme === 'system' ? t('theme.system')
                : theme === 'light' ? t('theme.light')
                  : t('theme.dark')}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme('light')}
              >
                {t('theme.light')}
                <DropdownMenuShortcut>
                  <Sun size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
              >
                {t('theme.dark')}
                <DropdownMenuShortcut>
                  <Moon size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
              >
                {t('theme.system')}
                <DropdownMenuShortcut>
                  <SunMoon size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {t('commom.locale')}: {language === 'en' ? 'en-US' : 'pt-BR'}
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
          {t('commom.logout')}
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
  const t = useTranslations()

  return (
    <header className="bg-muted shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          {t('app.title')}
        </Link>
        <nav>
          {status === 'loading' ? (
            <span>
              {t('commom.loading')}
            </span>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <Link href="/calculator">
                <Button size="sm">
                  <Calculator size={16} />
                  {isMobile ? '' : t('commom.calculator')}
                </Button>
              </Link>
              <Menu>
                <Avatar className='w-8 h-8'>
                  <AvatarImage src={session.user?.image ?? ''} alt="Avatar" />
                  <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Menu>
            </div>
          ) : (
            <Link href="/login">
              <Button>
                {t('commom.sign-in')}
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
