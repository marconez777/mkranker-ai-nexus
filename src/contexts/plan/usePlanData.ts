
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
  const [previousPlanType, setPreviousPlanType] = useState<PlanType | null>(null);

  const refreshPlan = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      // Criar perfil se não existir
      if (!profileData) {
        console.log("Perfil não encontrado. Criando novo para:", userId);
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            is_active: true,
            plan_type: 'free'
          });
          
        if (createProfileError) {
          console.error("Erro ao criar perfil:", createProfileError);
        }
      }
      
      // Definir tipo de plano padrão
      let planType: PlanType = 'free';
      let oldPlanType: PlanType | null = previousPlanType;
      
      if (profileData?.plan_type) {
        oldPlanType = oldPlanType || profileData.plan_type as PlanType;
      }
      
      // Buscar assinatura ativa
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscription')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'ativo')
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error("Error fetching subscription:", subscriptionError);
      }

      // Verificar vencimento
      let isSubscriptionExpired = false;
      if (subscription && subscription.vencimento) {
        const expiryDate = new Date(subscription.vencimento);
        const today = new Date();
        isSubscriptionExpired = expiryDate < today;

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

      // Definir tipo de plano
      if (subscription && !isSubscriptionExpired) {
        planType = determinePlanFromSubscription(subscription);
      } else if (profileData?.plan_type && profileData.plan_type !== 'free') {
        planType = profileData.plan_type as PlanType;
      }

      // Construir plano final com limites
      let finalPlan = { ...PLANS[planType] };

      if (subscription?.plans && !isSubscriptionExpired) {
        const dbPlan = subscription.plans;
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

      // Verificar ou criar uso
      let usageData;
      const { data: existingUsage, error: usageSelectError, status } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if ((status === 406 || !existingUsage) && (!usageSelectError || usageSelectError.code === 'PGRST116')) {
        console.warn("Registro de uso não encontrado. Criando novo para o usuário:", userId);

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
          .maybeSingle();

        if (insertError) {
          console.error("Erro ao criar uso:", insertError);
        } else {
          usageData = newUsage;
        }
      } else if (existingUsage) {
        usageData = existingUsage;
      } else if (usageSelectError) {
        console.error("Erro ao buscar usage:", usageSelectError);
      }

      // Ajuste de créditos quando o plano é alterado de free para pago
      if (usageData && oldPlanType === 'free' && planType !== 'free' && oldPlanType !== planType) {
        console.log("Upgrade detectado de plano free para pago:", planType);
        
        // Calcular o número de usos que já foram feitos
        const usedCredits = {
          mercado_publico_alvo: usageData.mercado_publico_alvo || 0,
          palavras_chaves: usageData.palavras_chaves || 0,
          funil_busca: usageData.funil_busca || 0,
          meta_dados: usageData.meta_dados || 0,
          texto_seo_blog: usageData.texto_seo_blog || 0,
          texto_seo_lp: usageData.texto_seo_lp || 0,
          texto_seo_produto: usageData.texto_seo_produto || 0,
          pautas_blog: usageData.pautas_blog || 0
        };

        // Calcular créditos restantes do plano free
        const freeLimits = PLANS.free.limits;
        const remainingFreeCredits = {
          mercado_publico_alvo: Math.max(0, freeLimits.mercadoPublicoAlvo - usedCredits.mercado_publico_alvo),
          palavras_chaves: Math.max(0, freeLimits.palavrasChaves - usedCredits.palavras_chaves),
          funil_busca: Math.max(0, freeLimits.funilBusca - usedCredits.funil_busca),
          meta_dados: Math.max(0, freeLimits.metaDados - usedCredits.meta_dados),
          texto_seo_blog: Math.max(0, freeLimits.textoSeoBlog - usedCredits.texto_seo_blog),
          texto_seo_lp: Math.max(0, freeLimits.textoSeoLp - usedCredits.texto_seo_lp),
          texto_seo_produto: Math.max(0, freeLimits.textoSeoProduto - usedCredits.texto_seo_produto),
          pautas_blog: Math.max(0, freeLimits.pautasBlog - usedCredits.pautas_blog)
        };

        // Ajustar os contadores de uso para refletir o plano atual mais os créditos restantes do free
        // Isso funciona subtraindo os créditos restantes do free dos usos atuais
        const { error: updateError } = await supabase
          .from('user_usage')
          .update({
            mercado_publico_alvo: Math.max(0, usedCredits.mercado_publico_alvo - remainingFreeCredits.mercado_publico_alvo),
            palavras_chaves: Math.max(0, usedCredits.palavras_chaves - remainingFreeCredits.palavras_chaves),
            funil_busca: Math.max(0, usedCredits.funil_busca - remainingFreeCredits.funil_busca),
            meta_dados: Math.max(0, usedCredits.meta_dados - remainingFreeCredits.meta_dados),
            texto_seo_blog: Math.max(0, usedCredits.texto_seo_blog - remainingFreeCredits.texto_seo_blog),
            texto_seo_lp: Math.max(0, usedCredits.texto_seo_lp - remainingFreeCredits.texto_seo_lp),
            texto_seo_produto: Math.max(0, usedCredits.texto_seo_produto - remainingFreeCredits.texto_seo_produto),
            pautas_blog: Math.max(0, usedCredits.pautas_blog - remainingFreeCredits.pautas_blog),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Erro ao atualizar contadores de uso após upgrade:", updateError);
        } else {
          console.log("Contadores de uso atualizados após upgrade de plano");
          toast({
            title: "Plano atualizado",
            description: "Seus créditos não utilizados do plano Free foram mantidos!",
          });
          
          // Atualizar dados de uso após ajuste
          const { data: updatedUsage } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
            
          if (updatedUsage) {
            usageData = updatedUsage;
          }
        }
        
        // Atualizar o tipo de plano anterior
        setPreviousPlanType(planType);
      } else if (planType !== oldPlanType) {
        // Atualizar o tipo de plano anterior quando qualquer mudança de plano ocorrer
        setPreviousPlanType(planType);
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

  const determinePlanFromSubscription = (subscription: any): PlanType => {
    const planName = subscription.plans?.name?.toLowerCase() || '';
    if (planName.includes('escala')) return 'escala';
    if (planName.includes('discovery')) return 'discovery';
    if (planName.includes('solo')) return 'solo';
    return 'free';
  };

  useEffect(() => {
    if (userId) {
      refreshPlan();
    } else {
      setIsLoading(false);
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
