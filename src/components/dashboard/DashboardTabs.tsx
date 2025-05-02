
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisaoGeralTab } from "./tabs/VisaoGeralTab";
import { FinanceiroTab } from "./tabs/FinanceiroTab";
import { SuporteTab } from "./tabs/SuporteTab";

export const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="visao-geral">
      <TabsList className="mb-6">
        <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        <TabsTrigger value="suporte">Suporte</TabsTrigger>
      </TabsList>
      
      <TabsContent value="visao-geral">
        <VisaoGeralTab />
      </TabsContent>
      
      <TabsContent value="financeiro">
        <FinanceiroTab />
      </TabsContent>
      
      <TabsContent value="suporte">
        <SuporteTab />
      </TabsContent>
    </Tabs>
  );
};
