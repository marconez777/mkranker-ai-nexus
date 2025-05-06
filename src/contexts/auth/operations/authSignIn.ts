import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

export const signIn = async (
  email: string,
  password: string,
  isAdminLogin = false,
  navigate?: NavigateFunction
) => {
  try {
    console.log("Iniciando login com email:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Erro de autenticação:", error);
      throw error;
    }

    console.log("Resposta completa da autenticação:", data);

    if (!data.user) {
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }

    const userId = data.user.id;

    // Verificação de acesso administrativo
    if (isAdminLogin) {
      console.log("Login admin bem-sucedido");
      return { user: data.user, session: data.session };
    }

    // Obtem status do perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Erro ao verificar status da conta:", profileError);
      toast.error("Erro ao verificar status da conta");
      throw profileError;
    }

    const isActive = profileData?.is_active ?? false;

    // Busca assinatura (se houver)
  const { data: planData, error: planError } = await supabase
  .from("user_subscription")
  .select("status, plan_type")
  .eq("user_id", userId)
  .eq("status", "ativo")
  .maybeSingle();

if (planError) {
  console.warn("Erro ao buscar plano do usuário:", planError.message);
}

const isFreePlan = !planData || planData.plan_type === "free";

// Apenas bloqueia o login se a conta estiver inativa E não for plano free
if (!isActive && !isFreePlan) {
  toast.error("Conta pendente de ativação pelo administrador.");
  await supabase.auth.signOut();
  throw new Error("Conta pendente de ativação pelo administrador");
}


    console.log("Login liberado para plano", isFreePlan ? "gratuito" : "pago");
    return { user: data.user, session: data.session };

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};




