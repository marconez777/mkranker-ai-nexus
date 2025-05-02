
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Necessário para algumas bibliotecas funcionarem no Deno

import { corsHeaders } from "./config.ts";
import { getDefaultPlanId, ativarAssinatura, registrarHistoricoPagamento } from "./database.ts";
import { getPaymentDetails, extractPlanIdFromPayment, extractPaymentMethod } from "./mercadoPagoService.ts";
import { findUserByEmail, getPlanDuration } from "./userService.ts";

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
    
    // Buscar detalhes do pagamento
    const payment = await getPaymentDetails(paymentId);
    
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
    const user = await findUserByEmail(payerEmail);
    console.log(`Usuário encontrado: ${user.id}`);
    
    // Extrair referência externa (user_id e plan_id) do pagamento
    let planId = extractPlanIdFromPayment(payment);
    
    // Se não temos um plano, buscar o plano padrão
    if (!planId) {
      planId = await getDefaultPlanId();
    }
    
    // Buscar a duração em dias do plano
    const durationDays = await getPlanDuration(planId);
    
    // Extrair método de pagamento e valor
    const paymentMethod = extractPaymentMethod(payment);
    const amount = payment.transaction_amount || 0;
    
    // Registrar o pagamento no histórico de faturamento
    await registrarHistoricoPagamento(
      user.id,
      amount,
      "aprovado",
      paymentMethod,
      paymentId.toString()
    );
    
    // Ativar a assinatura do usuário
    await ativarAssinatura(user.id, planId, durationDays);
    
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
