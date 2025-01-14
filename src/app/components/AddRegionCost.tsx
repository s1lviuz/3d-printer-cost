'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useFormContext } from 'react-hook-form'

interface RegionCost {
  name: string
  kwhCost: number
}

export function AddRegionCost() {
  const methods = useFormContext<RegionCost>()

  const onSubmit = async (data: RegionCost) => {
    try {
      const response = await fetch('/api/region-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast("O novo custo regional foi adicionado com sucesso.")
        methods.reset()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao adicionar custo regional')
      }
    } catch (error) {
      toast("Houve um problema ao adicionar o custo regional.")
    }
  }

  return (
    <Card>
      <CardContent>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Região</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="kwhCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo do kWh (R$)</FormLabel>
              <FormControl>
                <Input
                  id="kwhCost"
                  type="number"
                  step="0.01"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}