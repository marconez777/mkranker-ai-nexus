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

    // Tenta buscar o perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", userId)
      .maybeSingle(); // ← evita erro 406

    if (profileError) {
      console.error("Erro ao verificar status da conta:", profileError);
      toast.error("Erro ao verificar status da conta");
      throw profileError;
    }

    let isActive = profileData?.is_active ?? false;

    // Se o perfil não existir, cria com plano free e ativo
    if (!profileData) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          is_active: true,
          plan_type: 'free'
        });

      if (insertError) {
        console.error("Erro ao criar perfil:", insertError);
        toast.error("Erro ao criar perfil.");
        throw insertError;
      }

      isActive = true; // perfil recém-criado já vem ativo
    }

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

    // Se a conta não está ativa mas tem plano pago, ativa automaticamente
    if (!isActive) {
      if (planData) {
        const { error: activationError } = await supabase
          .from("profiles")
          .update({ is_active: true })
          .eq("id", userId);

        if (activationError) {
          toast.error("Erro ao ativar conta automaticamente.");
          console.error("Erro ao ativar conta:", activationError);
        } else {
          console.log("Conta ativada automaticamente.");
        }
      } else {
        toast.error("Conta pendente de ativação pelo administrador.");
        await supabase.auth.signOut();
        throw new Error("Conta pendente de ativação pelo administrador");
      }
    }

    return { user: data.user, session: data.session };

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};
