
import { usePlan } from "@/contexts/PlanContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SubscriptionAlert {
  daysRemaining: number;
  showAlert: boolean;
  handleRenewClick: () => void;
}

export const useSubscriptionAlert = (): SubscriptionAlert => {
  const { currentPlan } = usePlan();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const checkSubscriptionExpiry = async () => {
      try {
        if (!user?.id) return;
        
        // Fetch user subscription data directly from Supabase
        const { data: subscription, error } = await supabase
          .from('user_subscription')
          .select('vencimento, status')
          .eq('user_id', user.id)
          .eq('status', 'ativo')
          .maybeSingle();
        
        if (error) {
          console.error("Erro ao verificar expiração da assinatura:", error);
          return;
        }
        
        if (subscription && subscription.vencimento) {
          const expiryDate = new Date(subscription.vencimento);
          const today = new Date();
          
          // Calculate difference in days
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          setDaysRemaining(diffDays);
          // Show alert if less than or equal to 5 days remaining and greater than 0
          setShowAlert(diffDays <= 5 && diffDays > 0);
        }
      } catch (error) {
        console.error("Erro ao verificar expiração da assinatura:", error);
      }
    };
    
    if (currentPlan.type !== 'free') {
      checkSubscriptionExpiry();
    }
  }, [currentPlan, user?.id]);
  
  const handleRenewClick = () => {
    navigate('/checkout');
  };
  
  return {
    daysRemaining,
    showAlert,
    handleRenewClick
  };
};
