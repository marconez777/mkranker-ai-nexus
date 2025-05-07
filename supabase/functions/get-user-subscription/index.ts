
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userId = userData.user.id;

    // Buscar o tipo de plano anterior
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    let previousPlanType = profileData?.plan_type || "free";

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Erro ao verificar perfil:", profileError);
    }

    if (!profileData) {
      const { error: insertProfileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: userData.user.user_metadata.full_name || userData.user.email?.split('@')[0],
          plan_type: 'free',
          is_active: true,
        });

      if (insertProfileError) {
        console.error("Erro ao criar perfil:", insertProfileError);
      }
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from("user_subscription")
      .select(`
        *,
        plans(
          id,
          name,
          price,
          request_limit,
          limite_mercado_publico,
          limite_funil_busca,
          limite_palavras_chave,
          limite_textos_seo,
          limite_pautas,
          limite_metadados
        )
      `)
      .eq("user_id", userId)
      .eq("status", "ativo")
      .maybeSingle();

    if (subscriptionError && subscriptionError.code && subscriptionError.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar assinatura: ${subscriptionError.message}`);
    }

    let subscriptionStatus = subscription?.status;
    let currentPlanType = subscription?.plans?.name?.toLowerCase() || previousPlanType;
    
    if (subscription && subscriptionStatus === 'ativo' && subscription.vencimento) {
      const expiryDate = new Date(subscription.vencimento);
      const today = new Date();
      if (expiryDate < today) {
        subscriptionStatus = 'vencido';
      }
    }

    // Verificar se houve upgrade do plano free para um plano pago
    const isUpgradeFromFree = previousPlanType === 'free' && 
      currentPlanType !== 'free' && 
      previousPlanType !== currentPlanType;

    const { data: usageData, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Se não existir registro de uso, criar um
    if (!usageData && (!usageError || usageError.code === 'PGRST116')) {
      const { error: insertError } = await supabase
        .from("user_usage")
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
        });

      if (insertError) {
        console.error("Erro ao criar registro de uso:", insertError);
      }
    } else if (usageError && usageError.code !== 'PGRST116') {
      console.error("Erro ao buscar dados de uso:", usageError);
    }

    // Se for um upgrade do plano free para pago, ajustar os contadores
    if (isUpgradeFromFree && usageData) {
      console.log("Detectado upgrade do plano free para pago:", currentPlanType);
      
      // Referência para os limites do plano free
      const freeLimits = {
        mercadoPublicoAlvo: 3,
        palavrasChaves: 3,
        funilBusca: 3,
        metaDados: 3,
        textoSeoBlog: 3,
        textoSeoLp: 3,
        textoSeoProduto: 3,
        pautasBlog: 3,
      };

      const usedCredits = {
        mercado_publico_alvo: usageData.mercado_publico_alvo || 0,
        palavras_chaves: usageData.palavras_chaves || 0,
        funil_busca: usageData.funil_busca || 0,
        meta_dados: usageData.meta_dados || 0,
        texto_seo_blog: usageData.texto_seo_blog || 0,
        texto_seo_lp: usageData.texto_seo_lp || 0,
        texto_seo_produto: usageData.texto_seo_produto || 0,
        pautas_blog: usageData.pautas_blog || 0,
      };

      // Calcular créditos restantes do plano free
      const remainingFreeCredits = {
        mercado_publico_alvo: Math.max(0, freeLimits.mercadoPublicoAlvo - usedCredits.mercado_publico_alvo),
        palavras_chaves: Math.max(0, freeLimits.palavrasChaves - usedCredits.palavras_chaves),
        funil_busca: Math.max(0, freeLimits.funilBusca - usedCredits.funil_busca),
        meta_dados: Math.max(0, freeLimits.metaDados - usedCredits.meta_dados),
        texto_seo_blog: Math.max(0, freeLimits.textoSeoBlog - usedCredits.texto_seo_blog),
        texto_seo_lp: Math.max(0, freeLimits.textoSeoLp - usedCredits.texto_seo_lp),
        texto_seo_produto: Math.max(0, freeLimits.textoSeoProduto - usedCredits.texto_seo_produto),
        pautas_blog: Math.max(0, freeLimits.pautasBlog - usedCredits.pautas_blog),
      };

      // Ajustar contadores de uso
      const { error: updateUsageError } = await supabase
        .from("user_usage")
        .update({
          mercado_publico_alvo: Math.max(0, usedCredits.mercado_publico_alvo - remainingFreeCredits.mercado_publico_alvo),
          palavras_chaves: Math.max(0, usedCredits.palavras_chaves - remainingFreeCredits.palavras_chaves),
          funil_busca: Math.max(0, usedCredits.funil_busca - remainingFreeCredits.funil_busca),
          meta_dados: Math.max(0, usedCredits.meta_dados - remainingFreeCredits.meta_dados),
          texto_seo_blog: Math.max(0, usedCredits.texto_seo_blog - remainingFreeCredits.texto_seo_blog),
          texto_seo_lp: Math.max(0, usedCredits.texto_seo_lp - remainingFreeCredits.texto_seo_lp),
          texto_seo_produto: Math.max(0, usedCredits.texto_seo_produto - remainingFreeCredits.texto_seo_produto),
          pautas_blog: Math.max(0, usedCredits.pautas_blog - remainingFreeCredits.pautas_blog),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updateUsageError) {
        console.error("Erro ao ajustar contadores de uso:", updateUsageError);
      } else {
        console.log("Créditos do plano free transferidos com sucesso");
      }
    }

    const { data: updatedUsageData } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const limitesDoPlano = subscription?.plans
      ? {
          palavras_chave: subscription.plans.limite_palavras_chave,
          textos_seo: subscription.plans.limite_textos_seo,
          mercado_publico: subscription.plans.limite_mercado_publico,
          funil_busca: subscription.plans.limite_funil_busca,
          pautas: subscription.plans.limite_pautas,
          metadados: subscription.plans.limite_metadados,
        }
      : {
          palavras_chave: 3,
          textos_seo: 3,
          mercado_publico: 3,
          funil_busca: 3,
          pautas: 3,
          metadados: 3,
        };

    const responseData = subscription
      ? {
          ...subscription,
          status: subscriptionStatus,
          limites: limitesDoPlano,
          usage: updatedUsageData || null,
          previousPlanType,
        }
      : {
          plan_type: 'free',
          status: 'ativo',
          limites: limitesDoPlano,
          usage: updatedUsageData || null,
          previousPlanType,
        };

    // Atualizar o tipo de plano anterior no perfil
    if (currentPlanType !== previousPlanType) {
      await supabase
        .from("profiles")
        .update({ plan_type: currentPlanType })
        .eq("id", userId);
    }

    return new Response(JSON.stringify({ data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erro ao buscar assinatura:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao buscar assinatura",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
