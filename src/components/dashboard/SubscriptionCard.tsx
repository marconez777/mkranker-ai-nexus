
import { usePlan } from "@/contexts/PlanContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function SubscriptionCard() {
  const { currentPlan } = usePlan();
  
  // Mock data for subscription - in a real app, this would come from the backend
  // This could be fetched from the same endpoint as useSubscriptionAlert uses
  const subscriptionData = {
    status: currentPlan.type !== 'free' ? "ativo" : null,
    vencimento: currentPlan.type !== 'free' ? new Date(2025, 5, 1) : null, // Example date
  };

  // Determine badge color based on status
  const getBadgeVariant = () => {
    if (!subscriptionData.status) return "warning";
    return subscriptionData.status === "ativo" ? "default" : "destructive";
  };

  // Format status text
  const getStatusText = () => {
    if (!subscriptionData.status) return "Sem assinatura";
    return subscriptionData.status === "ativo" ? "Ativo" : "Vencida";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Minha Assinatura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Plano</span>
          <span className="font-medium">{currentPlan.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status</span>
          <Badge 
            variant={getBadgeVariant()}
            className={`
              ${getBadgeVariant() === "default" ? "bg-green-500 hover:bg-green-600" : ""}
              ${getBadgeVariant() === "destructive" ? "bg-red-500 hover:bg-red-600" : ""}
              ${getBadgeVariant() === "warning" ? "bg-yellow-500 text-black hover:bg-yellow-600" : ""}
            `}
          >
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Vencimento</span>
          <span className="font-medium">
            {subscriptionData.vencimento 
              ? format(subscriptionData.vencimento, "dd/MM/yyyy") 
              : "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
