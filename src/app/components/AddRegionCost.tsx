'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AddRegionCost() {
  const [name, setName] = useState('')
  const [kwhCost, setKwhCost] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/region-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, kwhCost: parseFloat(kwhCost) }),
      })
      if (response.ok) {
        toast({
          title: "Custo regional adicionado",
          description: "O novo custo regional foi adicionado com sucesso.",
        })
        setName('')
        setKwhCost('')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao adicionar custo regional')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Houve um problema ao adicionar o custo regional.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Custo Regional</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Região</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="kwhCost">Custo do kWh (R$)</Label>
            <Input
              id="kwhCost"
              type="number"
              step="0.01"
              value={kwhCost}
              onChange={(e) => setKwhCost(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Adicionar Custo Regional</Button>
        </form>
      </CardContent>
    </Card>
  )
}

