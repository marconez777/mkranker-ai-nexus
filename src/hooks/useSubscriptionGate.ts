
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";

/**
 * Hook to check if the user has an active subscription
 * @returns boolean indicating if user can access subscription-gated features
 */
export const useSubscriptionGate = (): boolean => {
  const navigate = useNavigate();
  const { currentPlan } = usePlan();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Free plan users don't have access
    if (currentPlan.type === 'free') {
      toast.error("Você não tem uma assinatura ativa.");
      navigate('/checkout', { 
        state: { 
          message: "Sua assinatura está inativa ou vencida. Renove seu plano para acessar a plataforma." 
        } 
      });
      setHasAccess(false);
      return;
    }
    
    setHasAccess(true);
  }, [currentPlan, navigate]);
  
  return hasAccess;
};
