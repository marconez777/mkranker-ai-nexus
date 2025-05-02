
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuração CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Configurar cliente Supabase com a role de serviço para poder buscar em auth.users
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verificar se temos um token de autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Extrair o token
    const token = authHeader.replace("Bearer ", "");
    
    // Verificar o usuário pelo token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    const userId = userData.user.id;
    
    // Buscar os dados da assinatura com informações do plano
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
    
    if (subscriptionError) {
      throw new Error(`Erro ao buscar assinatura: ${subscriptionError.message}`);
    }
    
    // Verificar se a assinatura está vencida
    let subscriptionStatus = subscription?.status;
    if (subscription && subscriptionStatus === 'ativo' && subscription.vencimento) {
      const expiryDate = new Date(subscription.vencimento);
      const today = new Date();
      if (expiryDate < today) {
        subscriptionStatus = 'vencido';
      }
    }
    
    // Buscar os dados de uso atual do usuário
    const { data: usageData, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
      
    if (usageError && usageError.code !== 'PGRST116') {
      console.error("Erro ao buscar dados de uso:", usageError);
    }
    
    // Preparar o objeto de limites do plano
    const limitesDoPlano = subscription?.plans ? {
      palavras_chave: subscription.plans.limite_palavras_chave,
      textos_seo: subscription.plans.limite_textos_seo,
      mercado_publico: subscription.plans.limite_mercado_publico,
      funil_busca: subscription.plans.limite_funil_busca,
      pautas: subscription.plans.limite_pautas,
      metadados: subscription.plans.limite_metadados
    } : null;
    
    return new Response(
      JSON.stringify({ 
        data: subscription ? { 
          ...subscription,
          status: subscriptionStatus,
          limites: limitesDoPlano,
          usage: usageData || null
        } : null 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
    
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao buscar assinatura" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
