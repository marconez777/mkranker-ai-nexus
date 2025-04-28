
import { usePlan } from "@/contexts/PlanContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const useLimitChecker = (featureKey: keyof ReturnType<typeof usePlan>['currentPlan']['limits']) => {
  const { getRemainingUses, incrementUsage, currentPlan } = usePlan();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const checkAndIncrementUsage = async (): Promise<boolean> => {
    setIsChecking(true);

    try {
      const remaining = getRemainingUses(featureKey);
      
      if (remaining <= 0 && currentPlan.limits[featureKey] !== Infinity) {
        toast({
          variant: "destructive",
          title: "Limite atingido",
          description: `Você atingiu o limite de ${currentPlan.limits[featureKey]} ${String(featureKey)} no seu plano ${currentPlan.name}. Considere fazer upgrade para um plano superior.`,
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
