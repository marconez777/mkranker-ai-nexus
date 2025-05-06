
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
    
    // Verificar se o perfil existe, se não existir, criar
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Erro ao verificar perfil:", profileError);
    }
    
    // Se o perfil não existir, criar um novo
    if (!profileData) {
      const { error: insertProfileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: userData.user.user_metadata.full_name || userData.user.email?.split('@')[0],
          plan_type: 'free',
          is_active: true
        });
        
      if (insertProfileError) {
        console.error("Erro ao criar perfil:", insertProfileError);
      }
    }
    
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
    
    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
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
    
    // Verificar se já existe registro na tabela user_usage
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
          pautas_blog: 0
        });
        
      if (insertError) {
        console.error("Erro ao criar registro de uso:", insertError);
      }
    } else if (usageError && usageError.code !== 'PGRST116') {
      console.error("Erro ao buscar dados de uso:", usageError);
    }
    
    // Buscar novamente os dados de uso atualizados
    const { data: updatedUsageData } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
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
          usage: updatedUsageData || null
        } : null 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
    
  } catch (error: any) {
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
