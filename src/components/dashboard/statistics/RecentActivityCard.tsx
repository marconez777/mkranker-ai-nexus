
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const RecentActivityCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Suas últimas 5 atividades na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Análise de Mercado e Público Alvo</p>
              <p className="text-xs text-gray-500">Criado há 5 minutos</p>
            </div>
            <div className="text-xs text-gray-500">Marketing Digital</div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Texto SEO para Produto</p>
              <p className="text-xs text-gray-500">Criado há 1 hora</p>
            </div>
            <div className="text-xs text-gray-500">Smartphone XYZ</div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Palavras-Chave</p>
              <p className="text-xs text-gray-500">Criado há 3 horas</p>
            </div>
            <div className="text-xs text-gray-500">Marketing Digital</div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Texto SEO para Blog</p>
              <p className="text-xs text-gray-500">Criado ontem</p>
            </div>
            <div className="text-xs text-gray-500">Como fazer SEO</div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Funil de Busca</p>
              <p className="text-xs text-gray-500">Criado ontem</p>
            </div>
            <div className="text-xs text-gray-500">Consultoria SEO</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
