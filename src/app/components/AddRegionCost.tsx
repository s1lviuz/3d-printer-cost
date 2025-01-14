'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegionCosts } from "@/schemas/region-costs"
import { useFormContext } from 'react-hook-form'

export function AddRegionCost() {
  const methods = useFormContext<RegionCosts>()

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