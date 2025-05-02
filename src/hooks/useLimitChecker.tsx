
import { usePlan } from "@/contexts/PlanContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const useLimitChecker = (featureKey: keyof ReturnType<typeof usePlan>['currentPlan']['limits']) => {
  const { getRemainingUses, incrementUsage, currentPlan } = usePlan();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const redirectToCheckout = () => {
    navigate('/checkout', {
      state: {
        message: "Atualize seu plano para continuar utilizando esta funcionalidade."
      }
    });
  };

  const checkAndIncrementUsage = async (): Promise<boolean> => {
    setIsChecking(true);

    try {
      const remaining = getRemainingUses(featureKey);
      
      if (remaining <= 0 && currentPlan.limits[featureKey] !== Infinity) {
        toast({
          variant: "destructive",
          title: "Limite atingido",
          description: (
            <div className="flex flex-col gap-2">
              <p>Você atingiu o limite de {currentPlan.limits[featureKey]} {String(featureKey)} no seu plano {currentPlan.name}.</p>
              <Button 
                onClick={redirectToCheckout} 
                variant="outline" 
                className="mt-2"
              >
                Ativar um plano com mais recursos
              </Button>
            </div>
          ),
        });
        return false;
      }
      
      // Only increment if the operation will be performed
      const success = await incrementUsage(featureKey);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Erro ao processar",
          description: "Não foi possível processar sua solicitação. Tente novamente."
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error checking limits for ${String(featureKey)}:`, error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };
  
  return {
    checkAndIncrementUsage,
    isChecking,
    remaining: getRemainingUses(featureKey)
  };
};
