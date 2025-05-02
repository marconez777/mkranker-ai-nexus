
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PaymentHistoryCard } from "../PaymentHistoryCard";
import { SubscriptionCard } from "../SubscriptionCard";

export const FinanceiroTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SubscriptionCard />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>
                Visão geral das suas informações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Assinatura atual e histórico de pagamentos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <PaymentHistoryCard />
    </div>
  );
};
