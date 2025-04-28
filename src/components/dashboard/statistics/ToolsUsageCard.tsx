
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const ToolsUsageCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas Mais Utilizadas</CardTitle>
        <CardDescription>
          Suas ferramentas favoritas nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Mercado e Público Alvo</span>
                <span className="text-sm text-gray-500">38%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "38%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Texto SEO para Blog</span>
                <span className="text-sm text-gray-500">27%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "27%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Palavras Chaves</span>
                <span className="text-sm text-gray-500">22%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "22%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Funil de Busca</span>
                <span className="text-sm text-gray-500">13%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "13%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
