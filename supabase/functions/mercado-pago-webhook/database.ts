
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

// Configuração do cliente Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

interface BillingRecord {
  user_id: string;
  amount: number;
  status: string;
  method?: string;
  reference?: string;
}

// Função para inserir registro no histórico de pagamentos
export async function insertBillingHistory(billingData: BillingRecord) {
  console.log("Inserindo registro de pagamento:", billingData);
  
  try {
    const { data, error } = await supabase
      .from("billing_history")
      .insert([billingData]);
      
    if (error) {
      console.error("Erro ao inserir registro no histórico de pagamentos:", error);
      throw error;
    }
    
    console.log("Registro de pagamento inserido com sucesso");
    return data;
  } catch (error) {
    console.error("Falha ao inserir registro no histórico de pagamentos:", error);
    throw error;
  }
}
