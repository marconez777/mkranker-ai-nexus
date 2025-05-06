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
      if (!user?.id || !currentPlan || currentPlan.type === 'free') return;

      try {
        const { data, error } = await supabase
          .from("user_subscription")
          .select("vencimento, status")
          .eq("user_id", user.id)
          .eq("status", "ativo")
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar dados de assinatura:", error);
          return;
        }

        if (!data?.vencimento) return;

        const expiryDate = new Date(data.vencimento);
        const today = new Date();

        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysRemaining(diffDays);
        setShowAlert(diffDays <= 5 && diffDays > 0);
      } catch (err) {
        console.error("Erro ao verificar expiração da assinatura:", err);
      }
    };

    checkSubscriptionExpiry();
  }, [user?.id, currentPlan?.type]);

  const handleRenewClick = () => {
    navigate("/checkout");
  };

  return {
    daysRemaining,
    showAlert,
    handleRenewClick,
  };
};
