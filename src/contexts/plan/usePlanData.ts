
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
        .maybeSingle(); // Mudado de .single() para .maybeSingle()
        
      if (profileError && profileError.code !== 'PGRST116') {
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
      
      // Check if subscription is expired
      let isSubscriptionExpired = false;
      if (subscription && subscription.vencimento) {
        const expiryDate = new Date(subscription.vencimento);
        const today = new Date();
        isSubscriptionExpired = expiryDate < today;
        
        // If subscription is expired, update its status in the database
        if (isSubscriptionExpired && subscription.status === 'ativo') {
          const { error: updateError } = await supabase
            .from('user_subscription')
            .update({ status: 'expirado' })
            .eq('user_id', userId);
            
          if (updateError) {
            console.error("Error updating subscription status:", updateError);
          }
        }
      }
      
      // Set plan based on subscription or profile
      // If no subscription or expired subscription, use the free plan
      let planType: PlanType = 'free';
      
      if (subscription && !isSubscriptionExpired) {
        planType = determinePlanFromSubscription(subscription);
      } else if (profileData?.plan_type) {
        // Fallback to profile plan_type only if it's not the default 'free'
        // This allows manual override in profiles table
        const profilePlanType = profileData.plan_type as PlanType;
        if (profilePlanType !== 'free') {
          planType = profilePlanType;
        }
      }
      
      // Create a merged plan with database limits if available
      let finalPlan = { ...PLANS[planType] };
      
      // If we have a subscription with plan limits and it's not expired, override the default limits
      if (subscription?.plans && !isSubscriptionExpired) {
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
      
      // Fetch usage data - Create user_usage record if it doesn't exist
      let usageData;
      const { data: existingUsage, error: usageSelectError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Mudado de .single() para .maybeSingle()
        
      if (usageSelectError && usageSelectError.code !== 'PGRST116') {
        console.error("Error fetching usage:", usageSelectError);
      }
      
      // If no usage record exists, create one
      if (!existingUsage) {
        console.log("No usage record found, creating one for user:", userId);
        
        const { data: newUsage, error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: userId,
            mercado_publico_alvo: 0,
            palavras_chaves: 0,
            funil_busca: 0,
            meta_dados: 0,
            texto_seo_blog: 0,
            texto_seo_lp: 0,
            texto_seo_produto: 0,
            pautas_blog: 0,
            updated_at: new Date().toISOString()
          })
          .select('*')
          .single();
          
        if (insertError) {
          console.error("Error creating usage record:", insertError);
        } else {
          usageData = newUsage;
        }
      } else {
        usageData = existingUsage;
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
      
    } catch (error: any) {
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
    const planName = subscription.plans?.name?.toLowerCase() || '';
    
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
    } else {
      setIsLoading(false); // Se não há userId, não há por que ficar carregando
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
