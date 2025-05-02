
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const SuporteTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suporte ao Cliente</CardTitle>
        <CardDescription>
          Entre em contato com nossa equipe de suporte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Em breve você poderá interagir com nosso assistente de suporte automatizado.
        </p>
      </CardContent>
    </Card>
  );
};
