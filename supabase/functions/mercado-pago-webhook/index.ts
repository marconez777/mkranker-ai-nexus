import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Configuração CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { getPaymentDetails, extractPlanIdFromPayment, extractPaymentMethod } from "./mercadoPagoService.ts";
import { createUserSubscription, updateUserPlan } from "./userService.ts";
import { insertBillingHistory } from "./database.ts";

// Handler principal do webhook
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verificar se a requisição é do tipo POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Método não permitido" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    console.log("Webhook recebido:", body);

    // Processar apenas notificações de pagamento
    if (body.type !== "payment") {
      return new Response(JSON.stringify({ message: "Webhook recebido, mas não é um evento de pagamento" }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Obter o ID do pagamento
    const paymentId = body.data?.id;
    if (!paymentId) {
      throw new Error("ID do pagamento não encontrado no webhook");
    }

    console.log(`Processando notificação de pagamento ID: ${paymentId}`);

    // Buscar detalhes do pagamento via API do Mercado Pago
    const payment = await getPaymentDetails(paymentId);
    console.log("Detalhes do pagamento:", payment);

    // Verificar se o pagamento foi aprovado
    if (payment.status !== "approved") {
      console.log(`Pagamento ${paymentId} não está aprovado (status: ${payment.status}). Ignorando.`);
      return new Response(JSON.stringify({ message: `Pagamento ${paymentId} não aprovado` }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Extrair ID do usuário da referência externa
    let userId = null;
    if (payment.external_reference) {
      const match = payment.external_reference.match(/user_([^_]+)_plan/);
      if (match && match[1]) {
        userId = match[1];
      }
    }

    // Extrair tipo de plano
    const planId = extractPlanIdFromPayment(payment);
    console.log(`Plano identificado: ${planId}, Usuário: ${userId || "Anônimo"}`);

    if (!planId) {
      throw new Error("Não foi possível identificar o plano associado ao pagamento");
    }

    // Se temos um usuário, atualizar sua assinatura
    if (userId) {
      console.log(`Atualizando assinatura para usuário ${userId}, plano ${planId}`);
      
      // Atualizar o plano do usuário
      await updateUserPlan(userId, planId);
      
      // Criar ou atualizar a assinatura do usuário
      await createUserSubscription(userId, planId);
      
      // Inserir registro no histórico de pagamentos
      const paymentMethod = extractPaymentMethod(payment);
      await insertBillingHistory({
        user_id: userId,
        amount: parseFloat(payment.transaction_amount) || 0,
        status: "aprovado",
        method: paymentMethod,
        reference: payment.id.toString()
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Pagamento ${paymentId} processado com sucesso` 
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erro interno ao processar webhook" 
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
