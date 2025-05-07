
// This function needs to be updated to handle the free plan upgrade scenario.
// Note: The edge function code typically has more complex logic and interfaces with
// Supabase admin client. I'm showing a concise version here.

// Import any necessary dependencies here
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define the plan types and limits directly in the edge function
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

// Define the free plan limits
const FREE_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: 3,
  palavrasChaves: 3,
  funilBusca: 3,
  metaDados: 3,
  textoSeoBlog: 3,
  textoSeoLp: 3,
  textoSeoProduto: 3,
  pautasBlog: 3,
};

// Create Supabase admin client here
const adminSupabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// User operations
export async function manualActivateSubscription(userId: string, data: any) {
  try {
    const { planType, vencimento, isUpgradeFromFree = false } = data;
    console.log(`Ativando plano ${planType} para usuário ${userId}, vencimento: ${vencimento}, upgrade do free: ${isUpgradeFromFree}`);

    // Buscar o id do plano na tabela plans
    const { data: planData, error: planError } = await adminSupabase
      .from("plans")
      .select("id")
      .eq("name", planType)
      .maybeSingle();

    if (planError) {
      console.error("Erro ao buscar plano:", planError);
      throw new Error("Plano não encontrado");
    }

    const planId = planData?.id;
    if (!planId) {
      throw new Error(`Plano "${planType}" não encontrado no banco de dados`);
    }

    // Verificar se já existe uma assinatura
    const { data: existingSubscription, error: subError } = await adminSupabase
      .from("user_subscription")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let subscriptionResult;
    if (existingSubscription) {
      // Atualizar assinatura existente
      const { data, error } = await adminSupabase
        .from("user_subscription")
        .update({
          plan_id: planId,
          status: "ativo",
          vencimento,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar assinatura:", error);
        throw new Error("Falha ao atualizar assinatura");
      }
      subscriptionResult = data;
    } else {
      // Criar nova assinatura
      const { data, error } = await adminSupabase
        .from("user_subscription")
        .insert({
          user_id: userId,
          plan_id: planId,
          status: "ativo",
          vencimento
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar assinatura:", error);
        throw new Error("Falha ao criar assinatura");
      }
      subscriptionResult = data;
    }

    // Atualizar o perfil do usuário
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({
        plan_type: planType,
        is_active: true,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Erro ao atualizar perfil:", profileError);
      // Continuar mesmo com erro no perfil
    }

    // Se for um upgrade do plano free, ajustar os créditos
    if (isUpgradeFromFree) {
      // Buscar os dados de uso atuais
      const { data: usageData, error: usageError } = await adminSupabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!usageError && usageData) {
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

        // Calcular créditos restantes
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
        const { error: updateUsageError } = await adminSupabase
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
          // Continue even if there's an error
        } else {
          console.log("Créditos do plano free transferidos com sucesso");
        }
      }
    }

    return {
      success: true,
      message: `Assinatura ${planType} ativada com sucesso para o usuário`,
      data: subscriptionResult,
    };
  } catch (error) {
    console.error("Erro em manualActivateSubscription:", error);
    throw error;
  }
}

// Include other operations here...
