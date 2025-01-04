'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AddFilament() {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [material, setMaterial] = useState('')
  const [cost, setCost] = useState(0)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/filaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color, material, cost }),
      })
      if (response.ok) {
        toast({
          title: "Filamento adicionado",
          description: "O novo filamento foi adicionado com sucesso.",
        })
        setName('')
        setColor('')
        setMaterial('')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao adicionar filamento')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Houve um problema ao adicionar o filamento.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Filamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Filamento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="color">Cor</Label>
            <Input
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="cost">Custo por Quilo</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(parseFloat(e.target.value))}
              required
            />
          </div>
          <Button type="submit">Adicionar Filamento</Button>
        </form>
      </CardContent>
    </Card>
  )
}

