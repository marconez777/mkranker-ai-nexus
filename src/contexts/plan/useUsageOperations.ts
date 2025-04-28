
import { PlanLimits } from '@/types/plans';
import { supabase } from '@/integrations/supabase/client';
import type { UsageData } from './types';
import { DEFAULT_USAGE } from './types';

export const useUsageOperations = (
  usageCounts: Record<keyof PlanLimits, number>,
  setUsageCounts: (counts: Record<keyof PlanLimits, number>) => void,
  userId?: string,
  currentPlan?: any
) => {
  const getRemainingUses = (feature: keyof PlanLimits) => {
    if (!currentPlan) return 0;
    const limit = currentPlan.limits[feature];
    const used = usageCounts[feature] || 0;
    return limit - used;
  };

  const incrementUsage = async (feature: keyof PlanLimits): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const newCount = (usageCounts[feature] || 0) + 1;
      
      setUsageCounts({
        ...usageCounts,
        [feature]: newCount
      });
      
      const featureToColumn: Record<keyof PlanLimits, keyof UsageData> = {
        mercadoPublicoAlvo: 'mercado_publico_alvo',
        palavrasChaves: 'palavras_chaves',
        funilBusca: 'funil_busca',
        metaDados: 'meta_dados',
        textoSeoBlog: 'texto_seo_blog',
        textoSeoLp: 'texto_seo_lp',
        textoSeoProduto: 'texto_seo_produto',
        pautasBlog: 'pautas_blog'
      };
      
      const { error } = await supabase
        .from('user_usage')
        .upsert({
          user_id: userId,
          [String(featureToColumn[feature])]: newCount,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id' 
        });
        
      if (error) {
        console.error(`Error updating usage for ${String(feature)}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error incrementing usage for ${String(feature)}:`, error);
      return false;
    }
  };

  const resetUsage = async (): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setUsageCounts(DEFAULT_USAGE);
      
      const { error } = await supabase
        .from('user_usage')
        .upsert({
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

  return {
    getRemainingUses,
    incrementUsage,
    resetUsage
  };
};
