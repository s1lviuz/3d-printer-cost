'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AddState() {
  const [name, setName] = useState('')
  const [kwhCost, setKwhCost] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, kwhCost: parseFloat(kwhCost) }),
      })
      if (response.ok) {
        toast({
          title: "Estado adicionado",
          description: "O novo estado foi adicionado com sucesso.",
        })
        setName('')
        setKwhCost('')
      } else {
        throw new Error('Falha ao adicionar estado')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um problema ao adicionar o estado.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Estado</Label>
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
          <Button type="submit">Adicionar Estado</Button>
        </form>
      </CardContent>
    </Card>
  )
}

