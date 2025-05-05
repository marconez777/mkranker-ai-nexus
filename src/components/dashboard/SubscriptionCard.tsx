import { usePlan } from "@/contexts/PlanContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Key, ArrowRight, Calendar, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function SubscriptionCard() {
  const { currentPlan, refreshPlan } = usePlan();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<{
    status: string | null;
    vencimento: Date | null;
    planType: string | null;
  }>({
    status: null,
    vencimento: null,
    planType: null
  });
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('user_subscription')
        .select('status, vencimento, plans(name)')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (!error && data) {
        // Check if subscription is expired but still marked as active
        const expiryDate = new Date(data.vencimento);
        const today = new Date();
        const isExpired = expiryDate < today;
        
        setSubscriptionData({
          status: isExpired && data.status === 'ativo' ? 'expirado' : data.status,
          vencimento: expiryDate,
          planType: data.plans?.name || null
        });
        
        // If we detected an expired subscription, refresh the plan data
        if (isExpired && data.status === 'ativo') {
          refreshPlan();
        }
      } else {
        // Fetch from profile as fallback
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', user.id)
          .single();
          
        if (!profileError && profileData) {
          setSubscriptionData({
            status: null,
            vencimento: null,
            planType: getPlanLabel(profileData.plan_type)
          });
        } else {
          setSubscriptionData({
            status: null,
            vencimento: null,
            planType: null
          });
        }
      }
    };
    
    fetchSubscription();
  }, [user?.id, refreshPlan]);

  // Get formatted plan label
  const getPlanLabel = (planType: string | null): string => {
    if (!planType) return "Free";
    
    switch(planType.toLowerCase()) {
      case 'solo': return "Plano Solo";
      case 'discovery': return "Plano Discovery";
      case 'escala': return "Plano Escala";
      default: return planType.charAt(0).toUpperCase() + planType.slice(1);
    }
  };

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
            <span className="flex items-center gap-1">
              {subscriptionData.status === "ativo" ? (
                <Check className="h-3 w-3" />
              ) : subscriptionData.status === "expirado" ? (
                <X className="h-3 w-3" />
              ) : null}
              {getStatusText()}
            </span>
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
          <span className="font-medium flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
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
