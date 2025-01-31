import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AllFilaments } from "../components/AllFilaments"
import { AllPrinters } from "../components/AllPrinters"
import { AllRegionsCost } from "../components/AllRegionsCost"
import { useTranslations } from "next-intl"

export default function ParametersPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('parameters.title')}</h1>
      <Tabs defaultValue="printers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="printers">{t('commom.printers')}</TabsTrigger>
          <TabsTrigger value="filaments">{t('commom.filaments')}</TabsTrigger>
          <TabsTrigger value="regionCosts">{t('commom.regions')}</TabsTrigger>
        </TabsList>
        <TabsContent value="printers">
          <AllPrinters />
        </TabsContent>
        <TabsContent value="filaments">
          <AllFilaments />
        </TabsContent>
        <TabsContent value="regionCosts">
          <AllRegionsCost />
        </TabsContent>
      </Tabs>
    </div>
  )
}