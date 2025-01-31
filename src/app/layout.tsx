import { Inter } from 'next/font/google'
import { Header } from './components/Header'
import Providers from './providers'
import { Toaster } from '@/components/ui/sonner'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Metadata } from 'next'
import { CookiesProvider } from 'next-client-cookies/server'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const messages = await getMessages({ locale }) as { metadata: { title: string, description: string } }

  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers>
          <NextIntlClientProvider
            messages={messages}>
            <CookiesProvider>
              <Header />
            </CookiesProvider>
            <main className='h-[calc(100%-72px)]'>{children}</main>
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
