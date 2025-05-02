
import React from "react";

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu dashboard personalizado
        </p>
      </div>
    </div>
  );
};
