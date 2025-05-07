
import { supabase } from '@/integrations/supabase/client';
import { UsageData, DEFAULT_USAGE } from '../types';

/**
 * Fetches or creates usage record for a user
 */
export const fetchOrCreateUsageRecord = async (userId: string): Promise<UsageData | null> => {
  try {
    // Check for existing usage
    const { data: existingUsage, error: usageSelectError, status } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if ((status === 406 || !existingUsage) && (!usageSelectError || usageSelectError.code === 'PGRST116')) {
      console.warn("Usage record not found. Creating new one for user:", userId);

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
        console.error("Error creating usage record:", insertError);
        return null;
      }
      
      return newUsage;
    } else if (existingUsage) {
      return existingUsage;
    } else if (usageSelectError) {
      console.error("Error fetching usage:", usageSelectError);
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchOrCreateUsageRecord:", error);
    return null;
  }
};

/**
 * Converts database usage record to frontend usage format
 */
export const mapUsageDataToFrontend = (usageData: UsageData | null) => {
  if (!usageData) return DEFAULT_USAGE;
  
  return {
    mercadoPublicoAlvo: usageData.mercado_publico_alvo || 0,
    palavrasChaves: usageData.palavras_chaves || 0,
    funilBusca: usageData.funil_busca || 0,
    metaDados: usageData.meta_dados || 0,
    textoSeoBlog: usageData.texto_seo_blog || 0,
    textoSeoLp: usageData.texto_seo_lp || 0,
    textoSeoProduto: usageData.texto_seo_produto || 0,
    pautasBlog: usageData.pautas_blog || 0
  };
};
