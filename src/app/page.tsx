import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className='flex flex-col justify-center p-4 w-fit mx-auto space-y-4'>
        <div className="w-48 h-48 mx-auto flex flex-col justify-center bg-[url(/fundo-2.png)] bg-cover bg-center rounded-3xl shadow" />
        <h1 className="text-4xl font-bold mb-4 text-center">Calculadora de Custo de Impressão 3D</h1>
        <p className="text-xl mb-8 text-center max-w-2xl mx-auto">
          Calcule com precisão o custo de suas impressões 3D, considerando energia, filamento e mais.
        </p>
        <div className="text-center">
          <Link href="/calculator">
            <Button size="lg">Começar a Calcular</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}



