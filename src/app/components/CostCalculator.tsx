'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { calculateEnergyConsumption, calculateEnergyCost, calculateFilamentCost, calculateTotalCost } from '@/utils/calculations'


interface Printer {
    id: number
    name: string
    wattage: number
}

interface Filament {
    id: number
    name: string
    color: string
    material: string
}

interface RegionCost {
    id: number
    name: string
    kwhCost: number
}

export function CostCalculator() {
    const [printers, setPrinters] = useState<Printer[]>([])
    const [filaments, setFilaments] = useState<Filament[]>([])
    const [regionCosts, setRegionCosts] = useState<RegionCost[]>([])
    const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null)
    const [selectedFilament, setSelectedFilament] = useState<Filament | null>(null)
    const [selectedRegionCost, setSelectedRegionCost] = useState<RegionCost | null>(null)
    const [printTime, setPrintTime] = useState<number>(0)
    const [filamentWeight, setFilamentWeight] = useState<number>(0)
    const [filamentCost, setFilamentCost] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<number | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const printersResponse = await fetch('/api/printers')
                const filamentsResponse = await fetch('/api/filaments')
                const regionCostsResponse = await fetch('/api/region-costs')

                if (!printersResponse.ok || !filamentsResponse.ok || !regionCostsResponse.ok) {
                    throw new Error('Failed to fetch data')
                }

                const printersData = await printersResponse.json()
                const filamentsData = await filamentsResponse.json()
                const regionCostsData = await regionCostsResponse.json()

                setPrinters(printersData)
                setFilaments(filamentsData)
                setRegionCosts(regionCostsData)
            } catch (error) {
                toast({
                    title: "Erro",
                    description: "Falha ao carregar dados. Por favor, tente novamente.",
                    variant: "destructive",
                })
            }
        }

        fetchData()
    }, [toast])

    const handleCalculate = () => {
        if (!selectedPrinter || !selectedRegionCost || !selectedFilament) {
            toast({
                title: "Erro",
                description: "Por favor, selecione todos os campos necessários.",
                variant: "destructive",
            })
            return
        }

        const energyConsumption = calculateEnergyConsumption(selectedPrinter.wattage, printTime)
        const energyCost = calculateEnergyCost(energyConsumption, selectedRegionCost.kwhCost)
        const filamentCostTotal = calculateFilamentCost(filamentCost, filamentWeight)
        const total = calculateTotalCost(energyCost, filamentCostTotal)
        setTotalCost(total)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Calculadora de Custo de Impressão 3D</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="printer">Impressora</Label>
                        <Select onValueChange={(value) => setSelectedPrinter(printers.find(p => p.id === parseInt(value)) || null)}>
                            <SelectTrigger id="printer">
                                <SelectValue placeholder="Selecione uma impressora" />
                            </SelectTrigger>
                            <SelectContent>
                                {printers.map((printer) => (
                                    <SelectItem key={printer.id} value={printer.id.toString()}>{printer.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filament">Filamento</Label>
                        <Select onValueChange={(value) => setSelectedFilament(filaments.find(f => f.id === parseInt(value)) || null)}>
                            <SelectTrigger id="filament">
                                <SelectValue placeholder="Selecione um filamento" />
                            </SelectTrigger>
                            <SelectContent>
                                {filaments.map((filament) => (
                                    <SelectItem key={filament.id} value={filament.id.toString()}>{filament.name} - {filament.color}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="regionCost">Região</Label>
                        <Select onValueChange={(value) => setSelectedRegionCost(regionCosts.find(r => r.id === parseInt(value)) || null)}>
                            <SelectTrigger id="regionCost">
                                <SelectValue placeholder="Selecione uma região" />
                            </SelectTrigger>
                            <SelectContent>
                                {regionCosts.map((regionCost) => (
                                    <SelectItem key={regionCost.id} value={regionCost.id.toString()}>{regionCost.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="printTime">Tempo de Impressão (horas)</Label>
                        <Input
                            id="printTime"
                            type="number"
                            min="0"
                            step="0.1"
                            value={printTime}
                            onChange={(e) => setPrintTime(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filamentWeight">Peso do Filamento (gramas)</Label>
                        <Input
                            id="filamentWeight"
                            type="number"
                            min="0"
                            step="0.1"
                            value={filamentWeight}
                            onChange={(e) => setFilamentWeight(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filamentCost">Custo do Filamento (R$/kg)</Label>
                        <Input
                            id="filamentCost"
                            type="number"
                            min="0"
                            step="0.01"
                            value={filamentCost}
                            onChange={(e) => setFilamentCost(Number(e.target.value))}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full">Calcular Custo Total</Button>
                </form>

                {totalCost !== null && (
                    <div className="mt-4 p-4 bg-secondary rounded-md">
                        <p className="text-lg font-semibold text-center">Custo Total Estimado: R$ {totalCost.toFixed(2)}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

