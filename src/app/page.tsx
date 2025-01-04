import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container h-full flex flex-col justify-center mx-auto p-4">
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
  )
}



