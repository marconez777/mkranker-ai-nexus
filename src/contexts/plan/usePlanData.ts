
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PLANS } from '@/types/plans';
import type { Plan, PlanType } from '@/types/plans';
import { toast } from "@/components/ui/use-toast";
import { UsageData, DEFAULT_USAGE } from './types';

export const usePlanData = (userId: string | undefined) => {
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.free);
  const [usageCounts, setUsageCounts] = useState(DEFAULT_USAGE);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPlan = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // First, fetch user profile to get plan type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      
      // Check if the user has an active subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscription')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'ativo')
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error("Error fetching subscription:", subscriptionError);
      }
      
      // Set plan based on subscription or profile
      const planType = subscription ? determinePlanFromSubscription(subscription) : (profileData?.plan_type as PlanType) || 'free';
      
      // Create a merged plan with database limits if available
      let finalPlan = { ...PLANS[planType] };
      
      // If we have a subscription with plan limits, override the default limits
      if (subscription?.plans) {
        const dbPlan = subscription.plans;
        
        // Override limits from database if they exist
        finalPlan.limits = {
          ...finalPlan.limits,
          mercadoPublicoAlvo: dbPlan.limite_mercado_publico ?? finalPlan.limits.mercadoPublicoAlvo,
          palavrasChaves: dbPlan.limite_palavras_chave ?? finalPlan.limits.palavrasChaves,
          funilBusca: dbPlan.limite_funil_busca ?? finalPlan.limits.funilBusca,
          metaDados: dbPlan.limite_metadados ?? finalPlan.limits.metaDados,
          textoSeoBlog: dbPlan.limite_textos_seo ?? finalPlan.limits.textoSeoBlog,
          textoSeoLp: dbPlan.limite_textos_seo ?? finalPlan.limits.textoSeoLp,
          textoSeoProduto: dbPlan.limite_textos_seo ?? finalPlan.limits.textoSeoProduto,
          pautasBlog: dbPlan.limite_pautas ?? finalPlan.limits.pautasBlog
        };
      }
      
      setCurrentPlan(finalPlan);
      
      // Fetch usage data
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (usageError && usageError.code !== 'PGRST116') {
        console.error("Error fetching usage:", usageError);
        throw usageError;
      }
      
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
        setUsageCounts(DEFAULT_USAGE);
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

  // Helper function to determine plan type from subscription
  const determinePlanFromSubscription = (subscription: any): PlanType => {
    const planName = subscription.plans.name.toLowerCase();
    
    if (planName.includes('escala')) return 'escala';
    if (planName.includes('discovery')) return 'discovery';
    if (planName.includes('solo')) return 'solo';
    
    // Default to free if no match
    return 'free';
  };

  // Initial load of plan data
  useEffect(() => {
    if (userId) {
      refreshPlan();
    }
  }, [userId]);

  return {
    currentPlan,
    usageCounts,
    setUsageCounts,
    isLoading,
    refreshPlan
  };
};
