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

    if (!data.user) {
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }

    const userId = data.user.id;

    if (isAdminLogin) {
      return { user: data.user, session: data.session };
    }

    // Verifica se está ativo no profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      toast.error("Erro ao verificar status da conta");
      throw profileError;
    }

    const isActive = profileData?.is_active ?? false;

    // Busca o plano (sem usar .single())
    const { data: planRows, error: planError } = await supabase
      .from("user_subscription")
      .select("status, plan_type")
      .eq("user_id", userId)
      .eq("status", "ativo");

    if (planError) {
      console.warn("Erro ao buscar plano do usuário:", planError);
    }

    const planData = planRows?.[0] ?? null;
    const isFreePlan = !planData || planData.plan_type === 'free';

    if (!isFreePlan && !isActive) {
      toast.error("Conta pendente de ativação pelo administrador.");
      await supabase.auth.signOut();
      throw new Error("Conta pendente de ativação pelo administrador");
    }

    return { user: data.user, session: data.session };

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};
