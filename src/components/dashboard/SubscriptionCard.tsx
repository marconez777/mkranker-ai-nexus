
import { usePlan } from "@/contexts/PlanContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Key, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function SubscriptionCard() {
  const { currentPlan, refreshPlan } = usePlan();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<{
    status: string | null;
    vencimento: Date | null;
  }>({
    status: null,
    vencimento: null
  });
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('user_subscription')
        .select('status, vencimento')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (!error && data) {
        // Check if subscription is expired but still marked as active
        const expiryDate = new Date(data.vencimento);
        const today = new Date();
        const isExpired = expiryDate < today;
        
        setSubscriptionData({
          status: isExpired && data.status === 'ativo' ? 'expirado' : data.status,
          vencimento: expiryDate
        });
        
        // If we detected an expired subscription, refresh the plan data
        if (isExpired && data.status === 'ativo') {
          refreshPlan();
        }
      } else {
        setSubscriptionData({
          status: null,
          vencimento: null
        });
      }
    };
    
    fetchSubscription();
  }, [user?.id, refreshPlan]);

  // Determine badge color based on status
  const getBadgeVariant = () => {
    if (!subscriptionData.status) return "secondary";
    if (subscriptionData.status === "expirado") return "warning";
    return subscriptionData.status === "ativo" ? "default" : "destructive";
  };

  // Format status text
  const getStatusText = () => {
    if (!subscriptionData.status) return "Sem assinatura";
    if (subscriptionData.status === "expirado") return "Expirado";
    return subscriptionData.status === "ativo" ? "Ativo" : "Inativo";
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
            variant={getBadgeVariant() as any}
            className={`
              ${getBadgeVariant() === "default" ? "bg-green-500 hover:bg-green-600" : ""}
              ${getBadgeVariant() === "destructive" ? "bg-red-500 hover:bg-red-600" : ""}
              ${getBadgeVariant() === "warning" ? "bg-amber-500 text-black hover:bg-amber-600" : ""}
              ${getBadgeVariant() === "secondary" ? "bg-gray-500 text-white hover:bg-gray-600" : ""}
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
          {subscriptionData.status === "expirado" ? "Renovar assinatura" : "Alterar Plano"} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
