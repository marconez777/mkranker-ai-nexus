
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { supabaseUrl, supabaseServiceKey } from "./config.ts";

// Criar o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para buscar o plano padrão (fallback)
export async function getDefaultPlanId(): Promise<string> {
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
export async function ativarAssinatura(userId: string, planId: string, durationDays: number) {
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

// Função para registrar pagamento no histórico de faturamento
export async function registrarHistoricoPagamento(
  userId: string,
  amount: number,
  status: string,
  method: string | null,
  reference: string | null
) {
  try {
    const { data, error } = await supabase
      .from("billing_history")
      .insert({
        user_id: userId,
        amount: amount,
        status: status,
        method: method,
        reference: reference,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Erro ao registrar histórico de pagamento:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Falha ao registrar histórico de pagamento:", error);
    throw error;
  }
}
