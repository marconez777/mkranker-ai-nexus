import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Usage {
  palavras_chaves: number;
  texto_seo_blog: number;
  texto_seo_lp: number;
  texto_seo_produto: number;
  funil_busca: number;
  mercado_publico_alvo: number;
  pautas_blog: number;
  meta_dados: number;
}

interface Subscription {
  status: 'ativo' | 'vencido' | 'inativo';
  vencimento: string;
  plano: 'solo' | 'discovery' | 'escala';
}

export function usePlanData(userId: string | null) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);

      // 1. Busca assinatura
      const { data: sub, error: subError } = await supabase
        .from('user_subscription')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subError || !sub) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      setSubscription(sub);

      // 2. Busca uso
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

      // 3. Se não existe uso, cria automaticamente com base no plano
      if (!usageData || usageError) {
        const defaultUsage = getCreditsByPlan(sub.plano);
        const { error: insertError } = await supabase
          .from('user_usage')
          .insert({ user_id: userId, ...defaultUsage });

        if (insertError) {
          console.error('Erro ao criar créditos iniciais:', insertError.message);
          setLoading(false);
          return;
        }

        setUsage(defaultUsage);
      } else {
        setUsage(usageData);
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return { usage, subscription, loading };
}

function getCreditsByPlan(plan: 'solo' | 'discovery' | 'escala'): Usage {
  if (plan === 'solo') {
    return {
      palavras_chaves: 20,
      texto_seo_blog: 15,
      texto_seo_lp: 10,
      texto_seo_produto: 10,
      funil_busca: 5,
      mercado_publico_alvo: 5,
      pautas_blog: 5,
      meta_dados: 50,
    };
  }

  if (plan === 'discovery') {
    return {
      palavras_chaves: 60,
      texto_seo_blog: 60,
      texto_seo_lp: 30,
      texto_seo_produto: 30,
      funil_busca: 15,
      mercado_publico_alvo: 15,
      pautas_blog: 15,
      meta_dados: 100,
    };
  }

  // Escala = ilimitado
  return {
    palavras_chaves: -1,
    texto_seo_blog: -1,
    texto_seo_lp: -1,
    texto_seo_produto: -1,
    funil_busca: -1,
    mercado_publico_alvo: -1,
    pautas_blog: -1,
    meta_dados: -1,
  };
}
