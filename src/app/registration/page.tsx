import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddRegionCost } from "../components/AddRegionCost"
import { AllFilaments } from "../components/AllFilaments"
import { AllPrinters } from "../components/AllPrinters"
import { AllRegionsCost } from "../components/AllRegionsCost"

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Cadastros</h1>
      <Tabs defaultValue="printers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="printers">Impressoras</TabsTrigger>
          <TabsTrigger value="filaments">Filamentos</TabsTrigger>
          <TabsTrigger value="regionCosts">Custos Regionais</TabsTrigger>
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

