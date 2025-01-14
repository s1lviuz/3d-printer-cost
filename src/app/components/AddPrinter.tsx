'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

export function AddPrinter() {
  const [name, setName] = useState('')
  const [wattage, setWattage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/printers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, wattage: parseInt(wattage) }),
      })
      if (response.ok) {
        toast("A nova impressora foi adicionada com sucesso.")
        setName('')
        setWattage('')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao adicionar impressora')
      }
    } catch (error) {
      toast("Houve um problema ao adicionar a impressora.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Nova Impressora</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Impressora</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="wattage">Potência (Watts)</Label>
            <Input
              id="wattage"
              type="number"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Adicionar Impressora</Button>
        </form>
      </CardContent>
    </Card>
  )
}

