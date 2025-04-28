
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const EstatisticasTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas Detalhadas</CardTitle>
        <CardDescription>
          Visualize o desempenho de suas ferramentas ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Dados detalhados de estatísticas serão exibidos aqui
        </p>
      </CardContent>
    </Card>
  );
};
