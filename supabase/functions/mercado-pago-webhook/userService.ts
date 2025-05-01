
import { supabase } from "./database.ts";

// Função para buscar um usuário pelo email
export async function findUserByEmail(email: string) {
  try {
    const { data: userData, error: userError } = await supabase.auth.admin
      .listUsers({ 
        filter: {
          email: `eq.${email}`
        }
      });
    
    if (userError || !userData.users.length) {
      console.error("Erro ao buscar usuário:", userError || "Usuário não encontrado");
      throw new Error(`Usuário com e-mail ${email} não encontrado`);
    }
    
    return userData.users[0];
  } catch (error) {
    console.error(`Erro ao buscar usuário por email ${email}:`, error);
    throw error;
  }
}

// Função para buscar a duração do plano em dias
export async function getPlanDuration(planId: string): Promise<number> {
  try {
    const { data: planData, error: planError } = await supabase
      .from("plans")
      .select("duration_days")
      .eq("id", planId)
      .maybeSingle();
    
    if (planError || !planData) {
      console.error("Erro ao buscar duração do plano:", planError || "Plano não encontrado");
      // Usar um valor padrão de 30 dias
      return 30;
    }
    
    return planData.duration_days;
  } catch (error) {
    console.error(`Erro ao buscar duração do plano ${planId}:`, error);
    return 30; // Valor padrão
  }
}
