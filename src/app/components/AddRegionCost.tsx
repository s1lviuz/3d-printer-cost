'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegionCosts } from "@/schemas/region-costs"
import { useFormContext } from 'react-hook-form'
import { useTranslations } from "next-intl"

export function AddRegionCost() {
  const methods = useFormContext<RegionCosts>()
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
          name="kwhCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('commom.costPerKwh')} (R$)</FormLabel>
              <FormControl>
                <Input
                  id="kwhCost"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    if (isNaN(value)) {
                      field.onChange(0)
                    } else {
                      field.onChange(value)
                    }
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