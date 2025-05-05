
import { useSubscriptionAlert } from "@/hooks/useSubscriptionAlert";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/contexts/PlanContext";

export const SubscriptionAlertBanner = () => {
  const { daysRemaining, showAlert, handleRenewClick } = useSubscriptionAlert();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpired, setIsExpired] = useState(false);
  const { refreshPlan } = usePlan();
  
  useEffect(() => {
    const checkExpiredSubscription = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('user_subscription')
        .select('status, vencimento')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (!error && data) {
        const expiryDate = new Date(data.vencimento);
        const today = new Date();
        
        if (expiryDate < today || data.status === 'expirado') {
          setIsExpired(true);
          // Refresh plan data to ensure everything is up to date
          refreshPlan();
        } else {
          setIsExpired(false);
        }
      }
    };
    
    checkExpiredSubscription();
  }, [user?.id, refreshPlan]);
  
  // If subscription is expired, show a persistent alert
  if (isExpired) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="flex items-center justify-between text-amber-800">
          <span>Sua assinatura expirou. Renove para continuar utilizando todas as funcionalidades.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/checkout')}
            className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
          >
            Renovar agora
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // If subscription is about to expire, show the regular alert
  if (showAlert) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <Bell className="h-4 w-4 text-amber-500" />
        <AlertDescription className="flex items-center justify-between text-amber-800">
          <span>Sua assinatura vence em <strong>{daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}</strong>.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRenewClick}
            className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
          >
            Renovar agora
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
