
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { UsageData } from '../types';

/**
 * Checks if subscription is expired
 */
export const checkSubscriptionExpiry = (subscription: any): boolean => {
  if (!subscription || !subscription.vencimento) return true;
  
  const expiryDate = new Date(subscription.vencimento);
  const today = new Date();
  return expiryDate < today;
};

/**
 * Updates expired subscription status in the database
 */
export const markSubscriptionExpired = async (userId: string) => {
  const { error } = await supabase
    .from('user_subscription')
    .update({ status: 'expirado' })
    .eq('user_id', userId);

  if (error) {
    console.error("Error updating subscription status:", error);
  }
};

/**
 * Adjusts usage counters after plan upgrade from free to paid
 */
export const adjustCreditsAfterUpgrade = async (
  userId: string, 
  usageData: UsageData
): Promise<UsageData | null> => {
  try {
    console.log("Adjusting credits after upgrade from free to paid plan", usageData);
    
    // Calculate the number of uses that already happened
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

    // Free plan limits are imported from PLANS.free.limits in the original file
    // For simplicity, we'll hardcode them here - ideally these would be imported
    const freeLimits = {
      mercado_publico_alvo: 3,
      palavras_chaves: 3,
      funil_busca: 3,
      meta_dados: 3,
      texto_seo_blog: 3,
      texto_seo_lp: 3,
      texto_seo_produto: 3,
      pautas_blog: 3
    };

    // Calculate remaining free credits
    const remainingFreeCredits = {
      mercado_publico_alvo: Math.max(0, freeLimits.mercado_publico_alvo - usedCredits.mercado_publico_alvo),
      palavras_chaves: Math.max(0, freeLimits.palavras_chaves - usedCredits.palavras_chaves),
      funil_busca: Math.max(0, freeLimits.funil_busca - usedCredits.funil_busca),
      meta_dados: Math.max(0, freeLimits.meta_dados - usedCredits.meta_dados),
      texto_seo_blog: Math.max(0, freeLimits.texto_seo_blog - usedCredits.texto_seo_blog),
      texto_seo_lp: Math.max(0, freeLimits.texto_seo_lp - usedCredits.texto_seo_lp),
      texto_seo_produto: Math.max(0, freeLimits.texto_seo_produto - usedCredits.texto_seo_produto),
      pautas_blog: Math.max(0, freeLimits.pautas_blog - usedCredits.pautas_blog)
    };

    // Update usage counters
    const updatedValues = {
      mercado_publico_alvo: Math.max(0, usedCredits.mercado_publico_alvo - remainingFreeCredits.mercado_publico_alvo),
      palavras_chaves: Math.max(0, usedCredits.palavras_chaves - remainingFreeCredits.palavras_chaves),
      funil_busca: Math.max(0, usedCredits.funil_busca - remainingFreeCredits.funil_busca),
      meta_dados: Math.max(0, usedCredits.meta_dados - remainingFreeCredits.meta_dados),
      texto_seo_blog: Math.max(0, usedCredits.texto_seo_blog - remainingFreeCredits.texto_seo_blog),
      texto_seo_lp: Math.max(0, usedCredits.texto_seo_lp - remainingFreeCredits.texto_seo_lp),
      texto_seo_produto: Math.max(0, usedCredits.texto_seo_produto - remainingFreeCredits.texto_seo_produto),
      pautas_blog: Math.max(0, usedCredits.pautas_blog - remainingFreeCredits.pautas_blog)
    };

    console.log("Updating usage counters after upgrade:", updatedValues);

    const { error } = await supabase
      .from('user_usage')
      .update({
        ...updatedValues,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error("Error updating usage counters after upgrade:", error);
      return null;
    }

    toast({
      title: "Plano atualizado",
      description: "Seus créditos não utilizados do plano Free foram mantidos!",
    });
    
    // Fetch updated usage data
    const { data: updatedUsage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    console.log("Updated usage after upgrade:", updatedUsage);
    return updatedUsage;
  } catch (error) {
    console.error("Error adjusting credits after upgrade:", error);
    return null;
  }
};
