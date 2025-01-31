'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from 'react-hook-form'
import { Printer } from "@/schemas/printer"
import { useTranslations } from "next-intl"

export function AddPrinter() {
  const methods = useFormContext<Printer>()

  const t = useTranslations()

  return (
    <Card className="my-4">
      <CardContent>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('commom.name')}</FormLabel>
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
              <FormLabel>{t('commom.wattage')} (Watts)</FormLabel>
              <FormControl>
                <Input
                  id="wattage"
                  type="number"
                  min={1}
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
