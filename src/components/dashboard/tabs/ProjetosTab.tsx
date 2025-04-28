
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const ProjetosTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seus Projetos</CardTitle>
        <CardDescription>
          Gerencie seus projetos de marketing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Lista de projetos será exibida aqui
        </p>
      </CardContent>
    </Card>
  );
};
