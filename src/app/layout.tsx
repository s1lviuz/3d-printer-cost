import { Inter } from 'next/font/google'
import { Header } from './components/Header'
import Providers from './providers'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Calculadora de Custo de Impressão 3D',
  description: 'Calcule o custo de suas impressões 3D com precisão',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className='h-[calc(100%-72px)]'>{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

