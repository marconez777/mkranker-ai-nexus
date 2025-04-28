
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
      
      // Get the plan type from the profile, default to 'free' if not set
      const planType = (profileData?.plan_type as PlanType) || 'free';
      setCurrentPlan(PLANS[planType]);
      
      // Now fetch usage data from the user_usage table
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (usageError && usageError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error("Error fetching usage:", usageError);
        throw usageError;
      }
      
      // If usage data exists, use it; otherwise, use default values (zeros)
      if (usageData) {
        setUsageCounts({
          mercadoPublicoAlvo: usageData.mercado_publico_alvo || 0,
          palavrasChaves: usageData.palavras_chaves || 0,
          funilBusca: usageData.funil_busca || 0,
          metaDados: usageData.meta_dados || 0,
          textoSeoBlog: usageData.texto_seo_blog || 0,
          textoSeoLp: usageData.texto_seo_lp || 0,
          textoSeoProduto: usageData.texto_seo_produto || 0,
          pautasBlog: usageData.pautas_blog || 0
        });
      } else {
        // Reset usage counts if no data found
        setUsageCounts({
          mercadoPublicoAlvo: 0,
          palavrasChaves: 0,
          funilBusca: 0,
          metaDados: 0,
          textoSeoBlog: 0,
          textoSeoLp: 0,
          textoSeoProduto: 0,
          pautasBlog: 0
        });
      }
      
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
      const newCount = (usageCounts[feature] || 0) + 1;
      
      setUsageCounts(prev => ({
        ...prev,
        [feature]: newCount
      }));
      
      // Convert camelCase to snake_case for database column names
      const featureToColumn: Record<keyof PlanLimits, string> = {
        mercadoPublicoAlvo: 'mercado_publico_alvo',
        palavrasChaves: 'palavras_chaves',
        funilBusca: 'funil_busca',
        metaDados: 'meta_dados',
        textoSeoBlog: 'texto_seo_blog',
        textoSeoLp: 'texto_seo_lp',
        textoSeoProduto: 'texto_seo_produto',
        pautasBlog: 'pautas_blog'
      };
      
      // Update usage in database using upsert
      const { error } = await supabase
        .from('user_usage')
        .upsert({
          user_id: user.id,
          [featureToColumn[feature]]: newCount,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id' 
        });
        
      if (error) {
        console.error(`Error updating usage for ${feature}:`, error);
        return false;
      }
      
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
      
      // Reset usage in database
      const { error } = await supabase
        .from('user_usage')
        .upsert({
          user_id: user.id,
          mercado_publico_alvo: 0,
          palavras_chaves: 0,
          funil_busca: 0,
          meta_dados: 0,
          texto_seo_blog: 0,
          texto_seo_lp: 0,
          texto_seo_produto: 0,
          pautas_blog: 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) {
        console.error("Error resetting usage in database:", error);
        return false;
      }
      
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
