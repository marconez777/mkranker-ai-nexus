
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisaoGeralTab } from "./tabs/VisaoGeralTab";
import { EstatisticasTab } from "./tabs/EstatisticasTab";
import { ProjetosTab } from "./tabs/ProjetosTab";

export const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="visao-geral">
      <TabsList className="mb-6">
        <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
        <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        <TabsTrigger value="projetos">Projetos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="visao-geral">
        <VisaoGeralTab />
      </TabsContent>
      
      <TabsContent value="estatisticas">
        <EstatisticasTab />
      </TabsContent>
      
      <TabsContent value="projetos">
        <ProjetosTab />
      </TabsContent>
    </Tabs>
  );
};
