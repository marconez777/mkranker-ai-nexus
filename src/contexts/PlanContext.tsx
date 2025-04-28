
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PLANS } from '@/types/plans';
import { toast } from "@/components/ui/use-toast";

// Define types for our plan structure
export type PlanType = 'free' | 'solo' | 'discovery' | 'escala';

export interface PlanLimits {
  mercadoPublicoAlvo: number;
  palavrasChaves: number;
  funilBusca: number;
  metaDados: number;
  textoSeoBlog: number;
  textoSeoLp: number;
  textoSeoProduto: number;
  pautasBlog: number;
}

export interface Plan {
  type: PlanType;
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: PlanLimits;
}

interface PlanContextType {
  currentPlan: Plan;
  getRemainingUses: (feature: keyof PlanLimits) => number;
  incrementUsage: (feature: keyof PlanLimits) => Promise<boolean>;
  resetUsage: () => Promise<boolean>;
  usageCounts: Record<keyof PlanLimits, number>;
  refreshPlan: () => Promise<void>;
  isLoading: boolean;
}

const PlanContext = createContext<PlanContextType | null>(null);

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.free);
  const [usageCounts, setUsageCounts] = useState<Record<keyof PlanLimits, number>>({
    mercadoPublicoAlvo: 0,
    palavrasChaves: 0,
    funilBusca: 0,
    metaDados: 0,
    textoSeoBlog: 0,
    textoSeoLp: 0,
    textoSeoProduto: 0,
    pautasBlog: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load the user's plan from the database
  useEffect(() => {
    if (user?.id) {
      refreshPlan();
    } else {
      setCurrentPlan(PLANS.free);
      setIsLoading(false);
    }
  }, [user]);

  const refreshPlan = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // First, check if user profile has plan information
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      
      // For now, let's default to the free plan
      // In a real app, you would fetch this from a plans table or subscription service
      const userPlanType: PlanType = 'free'; // Default to free plan
      
      setCurrentPlan(PLANS[userPlanType]);
      
      // Reset usage counts if it doesn't exist or is invalid
      const defaultCounts = {
        mercadoPublicoAlvo: 0,
        palavrasChaves: 0,
        funilBusca: 0,
        metaDados: 0,
        textoSeoBlog: 0,
        textoSeoLp: 0,
        textoSeoProduto: 0,
        pautasBlog: 0
      };
      
      setUsageCounts(defaultCounts);
      
    } catch (error) {
      console.error("Error loading plan:", error);
      toast({
        title: "Erro ao carregar plano",
        description: "Não foi possível carregar seu plano. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingUses = (feature: keyof PlanLimits) => {
    const limit = currentPlan.limits[feature];
    const used = usageCounts[feature] || 0;
    
    return limit - used;
  };

  const incrementUsage = async (feature: keyof PlanLimits): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Increment the local count first for immediate UI feedback
      setUsageCounts(prev => ({
        ...prev,
        [feature]: (prev[feature] || 0) + 1
      }));
      
      // TODO: In a real implementation, update the usage in the database
      // For now, we're just updating it locally
      
      return true;
    } catch (error) {
      console.error(`Error incrementing usage for ${feature}:`, error);
      return false;
    }
  };

  const resetUsage = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const resetCounts = {
        mercadoPublicoAlvo: 0,
        palavrasChaves: 0,
        funilBusca: 0,
        metaDados: 0,
        textoSeoBlog: 0,
        textoSeoLp: 0,
        textoSeoProduto: 0,
        pautasBlog: 0
      };
      
      setUsageCounts(resetCounts);
      
      // TODO: In a real implementation, reset the usage in the database
      
      return true;
    } catch (error) {
      console.error("Error resetting usage:", error);
      return false;
    }
  };

  return (
    <PlanContext.Provider value={{
      currentPlan,
      getRemainingUses,
      incrementUsage,
      resetUsage,
      usageCounts,
      refreshPlan,
      isLoading
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
