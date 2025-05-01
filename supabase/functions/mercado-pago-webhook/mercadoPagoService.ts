
import { MercadoPagoConfig, Payment } from "npm:mercadopago@2.0.6";
import { mercadoPagoAccessToken } from "./config.ts";

// Criar o cliente do Mercado Pago
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: mercadoPagoAccessToken,
});

// Função para buscar detalhes de um pagamento
export async function getPaymentDetails(paymentId: string) {
  try {
    const paymentClient = new Payment(mercadoPagoClient);
    console.log(`Buscando detalhes do pagamento ID: ${paymentId}`);
    const payment = await paymentClient.get({ id: paymentId });
    return payment;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do pagamento ${paymentId}:`, error);
    throw error;
  }
}

// Função para extrair o ID do plano do pagamento
export function extractPlanIdFromPayment(payment: any): string | null {
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
  
  return planId;
}
