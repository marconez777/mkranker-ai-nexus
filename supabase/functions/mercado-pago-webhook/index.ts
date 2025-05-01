
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Necessário para algumas bibliotecas funcionarem no Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// SDK do Mercado Pago
import { MercadoPagoConfig, Payment } from "npm:mercadopago@2.0.6";

// Configuração CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Criar o cliente do Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Criar o cliente do Mercado Pago
const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: mercadoPagoAccessToken || "",
});

// Função para buscar o plano padrão (fallback)
async function getDefaultPlanId() {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("id")
      .eq("name", "Discovery")
      .eq("is_active", true)
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Erro ao buscar plano padrão:", error);
    // Buscar qualquer plano ativo como último recurso
    const { data } = await supabase
      .from("plans")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .single();
    
    return data?.id;
  }
}

// Função para ativar a assinatura de um usuário
async function ativarAssinatura(userId: string, planId: string, durationDays: number) {
  const dataVencimento = new Date();
  dataVencimento.setDate(dataVencimento.getDate() + durationDays);
  
  // Verificar se o usuário já tem uma assinatura
  const { data: subscriptionData } = await supabase
    .from("user_subscription")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  
  // Atualizar profile para modificar o tipo de plano
  const planType = planId.toLowerCase().includes('escala') ? 'escala' : 
                  planId.toLowerCase().includes('solo') ? 'solo' : 'discovery';
  
  await supabase
    .from("profiles")
    .update({ 
      plan_type: planType,
      is_active: true 
    })
    .eq("id", userId);
  
  // Inserir ou atualizar a assinatura
  if (subscriptionData) {
    // Atualizar assinatura existente
    return await supabase
      .from("user_subscription")
      .update({
        status: "ativo",
        vencimento: dataVencimento.toISOString(),
        plan_id: planId,
        updated_at: new Date().toISOString()
      })
      .eq("id", subscriptionData.id);
  } else {
    // Criar nova assinatura
    return await supabase
      .from("user_subscription")
      .insert({
        user_id: userId,
        plan_id: planId,
        status: "ativo",
        vencimento: dataVencimento.toISOString()
      });
  }
}

serve(async (req) => {
  // CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verificar se a request é um POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método não permitido" }),
        { 
          status: 405, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Extrair o corpo da request
    const body = await req.json();
    console.log("Webhook recebido:", JSON.stringify(body));
    
    // Verificar se é uma notificação de pagamento
    if (!body.data || !body.data.id || body.type !== "payment") {
      console.log("Evento ignorado: não é uma notificação de pagamento");
      return new Response(
        JSON.stringify({ status: "ignorado", message: "Não é uma notificação de pagamento" }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Obter o ID do pagamento
    const paymentId = body.data.id;
    
    // Criar cliente de pagamento do Mercado Pago
    const paymentClient = new Payment(mercadoPagoClient);
    
    // Buscar detalhes do pagamento
    console.log(`Buscando detalhes do pagamento ID: ${paymentId}`);
    const payment = await paymentClient.get({ id: paymentId });
    console.log("Detalhes do pagamento:", JSON.stringify(payment));
    
    // Verificar se o pagamento foi aprovado
    if (payment.status !== "approved") {
      console.log(`Pagamento ${paymentId} não aprovado. Status: ${payment.status}`);
      return new Response(
        JSON.stringify({ status: "ignorado", message: `Pagamento com status ${payment.status}` }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Extrair o e-mail do comprador
    const payerEmail = payment.payer?.email;
    if (!payerEmail) {
      throw new Error("E-mail do comprador não encontrado no pagamento");
    }
    
    console.log(`Pagamento ${paymentId} aprovado para o e-mail: ${payerEmail}`);
    
    // Buscar o usuário pelo e-mail
    const { data: userData, error: userError } = await supabase.auth.admin
      .listUsers({ 
        filter: {
          email: `eq.${payerEmail}`
        }
      });
    
    if (userError || !userData.users.length) {
      console.error("Erro ao buscar usuário:", userError || "Usuário não encontrado");
      throw new Error(`Usuário com e-mail ${payerEmail} não encontrado`);
    }
    
    const user = userData.users[0];
    console.log(`Usuário encontrado: ${user.id}`);
    
    // Extrair referência externa (user_id e plan_id) do pagamento
    let planId = null;
    
    // Tentar extrair o plano da referência externa
    if (payment.external_reference) {
      const externalRef = payment.external_reference;
      if (externalRef.includes('plan_')) {
        planId = externalRef.split('plan_')[1];
      }
    }
    
    // Se não encontrou o plano na referência, tentar extrair do item
    if (!planId && payment.additional_info?.items?.length) {
      const item = payment.additional_info.items[0];
      planId = item.id;
    }
    
    // Se ainda não temos um plano, buscar o plano padrão
    if (!planId) {
      planId = await getDefaultPlanId();
    }
    
    // Buscar a duração em dias do plano
    const { data: planData, error: planError } = await supabase
      .from("plans")
      .select("duration_days")
      .eq("id", planId)
      .maybeSingle();
    
    if (planError || !planData) {
      console.error("Erro ao buscar duração do plano:", planError || "Plano não encontrado");
      // Usar um valor padrão de 30 dias
      const durationDays = 30;
      await ativarAssinatura(user.id, planId, durationDays);
    } else {
      await ativarAssinatura(user.id, planId, planData.duration_days);
    }
    
    console.log(`Assinatura ativada com sucesso para o usuário ${user.id}`);
    
    return new Response(
      JSON.stringify({ 
        status: "sucesso", 
        message: "Assinatura ativada com sucesso",
        user_id: user.id,
        plan_id: planId,
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
    
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    
    return new Response(
      JSON.stringify({ 
        status: "erro", 
        message: error.message || "Erro ao processar webhook" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
