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
  const { user } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscriptionExpiry = async () => {
      try {
        if (!user?.id) return;

        const { data: subscription, error } = await supabase
          .from("user_subscription")
          .select("vencimento, status")
          .eq("user_id", user.id)
          .eq("status", "ativo")
          .maybeSingle();

        if (error) {
          console.error("Erro ao verificar expiração da assinatura:", error);
          return;
        }

        // Se não houver assinatura ativa, assume-se que é um usuário free
        if (!subscription || !subscription.vencimento) {
          setDaysRemaining(0);
          setShowAlert(false);
          return;
        }

        const expiryDate = new Date(subscription.vencimento);
        const today = new Date();

        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysRemaining(diffDays);
        setShowAlert(diffDays <= 5 && diffDays > 0);
      } catch (error) {
        console.error("Erro inesperado ao verificar assinatura:", error);
      }
    };

    checkSubscriptionExpiry();
  }, [user?.id]);

  const handleRenewClick = () => {
    navigate("/checkout");
  };

  return {
    daysRemaining,
    showAlert,
    handleRenewClick
  };
};
