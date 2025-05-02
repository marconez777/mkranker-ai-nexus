
import { usePlan } from "@/contexts/PlanContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Key, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubscriptionCard() {
  const { currentPlan } = usePlan();
  const navigate = useNavigate();
  
  // Mock data for subscription - in a real app, this would come from the backend
  // This could be fetched from the same endpoint as useSubscriptionAlert uses
  const subscriptionData = {
    status: currentPlan.type !== 'free' ? "ativo" : null,
    vencimento: currentPlan.type !== 'free' ? new Date(2025, 5, 1) : null, // Example date
  };

  // Determine badge color based on status
  const getBadgeVariant = () => {
    if (!subscriptionData.status) return "secondary";
    return subscriptionData.status === "ativo" ? "default" : "destructive";
  };

  // Format status text
  const getStatusText = () => {
    if (!subscriptionData.status) return "Sem assinatura";
    return subscriptionData.status === "ativo" ? "Ativo" : "Vencida";
  };

  return (
    <Card className="border-gray-200 hover:border-gray-300 transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Minha Assinatura</CardTitle>
          </div>
          <Badge 
            variant={getBadgeVariant()}
            className={`
              ${getBadgeVariant() === "default" ? "bg-green-500 hover:bg-green-600" : ""}
              ${getBadgeVariant() === "destructive" ? "bg-red-500 hover:bg-red-600" : ""}
              ${getBadgeVariant() === "secondary" ? "bg-yellow-500 text-black hover:bg-yellow-600" : ""}
            `}
          >
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Plano</span>
          <span className="font-medium">{currentPlan.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Vencimento</span>
          <span className="font-medium">
            {subscriptionData.vencimento 
              ? format(subscriptionData.vencimento, "dd/MM/yyyy") 
              : "—"}
          </span>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 mt-2"
          onClick={() => navigate('/checkout')}
        >
          Alterar Plano <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
