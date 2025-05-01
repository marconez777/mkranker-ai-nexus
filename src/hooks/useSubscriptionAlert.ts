
import { usePlan } from "@/contexts/PlanContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface SubscriptionAlert {
  daysRemaining: number;
  showAlert: boolean;
  handleRenewClick: () => void;
}

export const useSubscriptionAlert = (): SubscriptionAlert => {
  const { currentPlan, usageCounts } = usePlan();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSubscriptionExpiry = async () => {
      try {
        // Buscar dados da assinatura do usuário
        const { data: subscription } = await fetch('/api/user-subscription').then(res => res.json());
        
        if (subscription && subscription.vencimento) {
          const expiryDate = new Date(subscription.vencimento);
          const today = new Date();
          
          // Calcular diferença em dias
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          setDaysRemaining(diffDays);
          setShowAlert(diffDays <= 5 && diffDays > 0);
        }
      } catch (error) {
        console.error("Erro ao verificar expiração da assinatura:", error);
      }
    };
    
    if (currentPlan.type !== 'free') {
      checkSubscriptionExpiry();
    }
  }, [currentPlan]);
  
  const handleRenewClick = () => {
    navigate('/checkout');
  };
  
  return {
    daysRemaining,
    showAlert,
    handleRenewClick
  };
};
