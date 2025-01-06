import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddPrinter } from "../components/AddPrinter"
import { AddFilament } from "../components/AddFilament"
import { AddRegionCost } from "../components/AddRegionCost"

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
          <AddPrinter />
        </TabsContent>
        <TabsContent value="filaments">
          <AddFilament />
        </TabsContent>
        <TabsContent value="regionCosts">
          <AddRegionCost />
        </TabsContent>
      </Tabs>
    </div>
  )
}

