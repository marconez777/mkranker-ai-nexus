
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

    // Verifica se já existe perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Erro ao verificar perfil da conta:", profileError);
      toast.error("Erro ao verificar perfil da conta");
      throw profileError;
    }

    // Cria perfil caso não exista
    if (!profileData) {
      console.log("Perfil não encontrado. Criando novo perfil para:", userId);
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
    }

    // Busca plano ativo
    const { data: planRows, error: planError } = await supabase
      .from("user_subscription")
      .select("status, plan_type")
      .eq("user_id", userId)
      .eq("status", "ativo");

    if (planError) {
      console.warn("Erro ao buscar plano do usuário:", planError);
      // Continue com o login mesmo se houver erro ao buscar o plano
    }

    return { user: data.user, session: data.session };

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};
