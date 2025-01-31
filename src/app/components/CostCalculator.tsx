'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateEnergyConsumption, calculateEnergyCost, calculateFilamentCost, calculateTotalCost } from '@/utils/calculations'
import { toast } from 'sonner'
import { Printer } from '@/schemas/printer'
import { Filament } from '@/schemas/filament'
import { RegionCosts } from '@/schemas/region-costs'
import { useQuery } from 'react-query'
import { useTranslations } from 'next-intl'

const fetchPrinters = async () => {
    const response = await fetch('/api/printers')
    if (!response.ok) throw new Error('Falha ao buscar impressoras')
    return response.json() as Promise<Printer[]>
}

const fetchFilaments = async () => {
    const response = await fetch('/api/filaments')
    if (!response.ok) throw new Error('Falha ao buscar filamentos')
    return response.json() as Promise<Filament[]>
}

const fetchRegionCosts = async () => {
    const response = await fetch('/api/region-costs')
    if (!response.ok) throw new Error('Failed to fetch region costs')
    return response.json() as Promise<RegionCosts[]>
}

export function CostCalculator() {
    const { data: printers, isFetching: printersLoading, isError: printersError } = useQuery('printers', fetchPrinters)
    const { data: filaments, isFetching: filamentsLoading, isError: filamentsError } = useQuery('filaments', fetchFilaments)
    const { data: regionCosts, isFetching: regionCostsLoading, isError: regionCostsError } = useQuery('region-costs', fetchRegionCosts)

    const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null)
    const [selectedFilament, setSelectedFilament] = useState<Filament | null>(null)
    const [selectedRegionCost, setSelectedRegionCost] = useState<RegionCosts | null>(null)
    const [printTime, setPrintTime] = useState<number>()
    const [filamentWeight, setFilamentWeight] = useState<number>()
    const [totalCost, setTotalCost] = useState<number | null>(null)

    const t = useTranslations()

    const handleCalculate = () => {
        if (!selectedPrinter || !selectedRegionCost || !selectedFilament) {
            toast(t('calculator.form.error.missingFields'))
            return
        }

        const energyConsumption = calculateEnergyConsumption(selectedPrinter.wattage, printTime ?? 0)
        const energyCost = calculateEnergyCost(energyConsumption, selectedRegionCost.kwhCost)
        const filamentCostTotal = calculateFilamentCost(selectedFilament.cost, filamentWeight ?? 0)
        const total = calculateTotalCost(energyCost, filamentCostTotal)
        setTotalCost(total)
    }

    useEffect(() => {
        if (printersError) {
            return
        }

        const emptyRegionCosts = regionCosts && regionCosts.length === 0

        if (emptyRegionCosts) {
            toast(t('calculator.toast.error.noRegions'))
        }
    }, [regionCosts])

    useEffect(() => {
        if (printersError) {
            return
        }

        const emptyFilaments = filaments && filaments.length === 0

        if (emptyFilaments) {
            toast(t('calculator.toast.error.noFilaments'))
        }
    }, [filaments])

    useEffect(() => {
        if (printersError) {
            return
        }

        const emptyPrinters = printers && printers.length === 0

        if (emptyPrinters) {
            toast(t('calculator.toast.error.noPrinters'))
        }
    }, [printers])

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {t('calculator.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="printer">
                            {t('commom.printer')}
                        </Label>
                        <Select onValueChange={(value) => setSelectedPrinter(printers?.find(p => p.id === parseInt(value)) || null)} required>
                            <SelectTrigger id="printer">
                                <SelectValue placeholder={t('calculator.form.printer.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {printers?.map((printer) => (
                                    <SelectItem key={printer.id} value={printer.id?.toString() ?? ''}>{printer.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filament">
                            {t('commom.filament')}
                        </Label>
                        <Select onValueChange={(value) => setSelectedFilament(filaments?.find(f => f.id === parseInt(value)) || null)} required>
                            <SelectTrigger id="filament">
                                <SelectValue placeholder={t('calculator.form.filament.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {filaments?.map((filament) => (
                                    <SelectItem key={filament.id} value={filament.id?.toString() ?? ''}>{filament.name} - {filament.material} - {filament.color} - R$ {filament.cost.toFixed(2)}/kg</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="regionCost">
                            {t('commom.region')}
                        </Label>
                        <Select onValueChange={(value) => setSelectedRegionCost(regionCosts?.find(r => r.id === parseInt(value)) || null)} required>
                            <SelectTrigger id="regionCost">
                                <SelectValue placeholder={t('calculator.form.region.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {regionCosts?.map((regionCost) => (
                                    <SelectItem key={regionCost.id} value={regionCost.id?.toString() ?? ''}>{regionCost.name} - R$ {regionCost.kwhCost.toFixed(2)}/kWh</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="printTime">{t('calculator.form.time.label')}</Label>
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
                        <Label htmlFor="filamentWeight">{t('calculator.form.weight.label')}</Label>
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

                    <Button type="submit" className="w-full">{t('calculator.form.button')}</Button>
                </form>

                {totalCost !== null && (
                    <div className="mt-4 p-4 bg-secondary rounded-md">
                        <p className="text-lg font-semibold text-center">{t('calculator.result.description')}: {t('calculator.result.currency')} {totalCost.toFixed(2)}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

