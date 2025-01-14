'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useFormContext } from 'react-hook-form'
import { Printer } from "@/schemas/printer"

export function AddPrinter() {
  const methods = useFormContext<Printer>()

  const onSubmit = async (data: Printer) => {
    try {
      const response = await fetch('/api/printers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast("A nova impressora foi adicionada com sucesso.")
        methods.reset()
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
      <CardContent>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Impressora</FormLabel>
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
          name="wattage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potência (Watts)</FormLabel>
              <FormControl>
                <Input
                  id="wattage"
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    field.onChange(value)
                  }}
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
