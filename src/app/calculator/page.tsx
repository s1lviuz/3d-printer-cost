import { CostCalculator } from '../components/CostCalculator'

export default function CalculatorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Custo de Impressão 3D</h1>
      <CostCalculator />
    </div>
  )
}
