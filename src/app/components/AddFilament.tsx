'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from 'react-hook-form'
import { Filament } from "@/schemas/filament"
import { useTranslations } from "next-intl"

export function AddFilament() {
  const methods = useFormContext<Filament>()
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('commom.color')}</FormLabel>
              <FormControl>
                <Input
                  id="color"
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
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('commom.material')}</FormLabel>
              <FormControl>
                <Input
                  id="material"
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
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('commom.costPerKg')}</FormLabel>
              <FormControl>
                <Input
                  id="cost"
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