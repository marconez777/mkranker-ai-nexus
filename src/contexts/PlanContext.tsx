
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Plan, PlanType, PLANS } from "@/types/plans";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlanContextType {
  currentPlan: Plan;
  isLoading: boolean;
  updateUserPlan: (planType: PlanType) => Promise<void>;
  getRemainingUses: (featureKey: keyof Plan['limits']) => number;
  incrementUsage: (featureKey: keyof Plan['limits']) => Promise<boolean>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.solo);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch the user's current plan from Supabase
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user plan from profiles or a dedicated plans table
          const { data } = await supabase
            .from('profiles')
            .select('plan_type, usage_counts')
            .eq('id', user.id)
            .single();

          if (data) {
            const planType = data.plan_type as PlanType || 'solo';
            setCurrentPlan(PLANS[planType]);
            
            if (data.usage_counts) {
              setUsageCounts(data.usage_counts);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  const updateUserPlan = async (planType: PlanType) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ plan_type: planType })
          .eq('id', user.id);

        if (error) throw error;
        
        setCurrentPlan(PLANS[planType]);
        
        toast({
          title: "Plano atualizado",
          description: `Seu plano foi atualizado para ${PLANS[planType].name}.`,
        });
      }
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar seu plano. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingUses = (featureKey: keyof Plan['limits']) => {
    const limit = currentPlan.limits[featureKey];
    const used = usageCounts[featureKey] || 0;
    
    // If limit is Infinity, return a large number to represent unlimited
    if (limit === Infinity) return 999;
    
    return Math.max(0, limit - used);
  };

  const incrementUsage = async (featureKey: keyof Plan['limits']) => {
    // Check if user is at limit
    if (getRemainingUses(featureKey) <= 0 && currentPlan.limits[featureKey] !== Infinity) {
      toast({
        variant: "destructive",
        title: "Limite atingido",
        description: `Você atingiu o limite para este recurso no seu plano ${currentPlan.name}.`,
      });
      return false;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update local usage count
        const newUsageCounts = {
          ...usageCounts,
          [featureKey]: (usageCounts[featureKey] || 0) + 1
        };
        
        setUsageCounts(newUsageCounts);

        // Update in database
        const { error } = await supabase
          .from('profiles')
          .update({ usage_counts: newUsageCounts })
          .eq('id', user.id);

        if (error) throw error;
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating usage count:', error);
      return false;
    }
  };

  const value = {
    currentPlan,
    isLoading,
    updateUserPlan,
    getRemainingUses,
    incrementUsage
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
