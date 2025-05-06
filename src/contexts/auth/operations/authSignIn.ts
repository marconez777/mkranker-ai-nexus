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
    console.log("➡️ Iniciando login com email:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("❌ Erro de autenticação:", error);
      toast.error("Erro de autenticação");
      throw error;
    }

    if (!data.user) {
      toast.error("Falha na autenticação: nenhum usuário retornado");
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }

    const userId = data.user.id;
    console.log("✅ Login bem-sucedido. ID do usuário:", userId);

    if (isAdminLogin) {
      return { user: data.user, session: data.session };
    }

    // Verifica se já existe perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("❌ Erro ao verificar status da conta:", profileError);
      toast.error("Erro ao verificar status da conta");
      throw profileError;
    }

    let isActive = profileData?.is_active ?? false;
    console.log("ℹ️ Perfil existe?", !!profileData, "| Ativo?", isActive);

    if (!profileData) {
      console.log("➕ Criando novo perfil e registro user_usage para:", userId);

      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          is_active: true,
          plan_type: 'free'
        });

      if (insertError) {
        console.error("❌ Erro ao criar perfil:", insertError);
        toast.error("Erro ao criar perfil.");
        throw insertError;
      }

      const { error: usageError } = await supabase
        .from("user_usage")
        .insert({
          user_id: userId,
          mercado_publico_alvo: 0,
          palavras_chaves: 0,
          funil_busca: 0,
          meta_dados: 0,
          texto_seo_blog: 0,
          texto_seo_lp: 0,
          texto_seo_produto: 0,
          pautas_blog: 0,
          updated_at: new Date().toISOString()
        });

      if (usageError) {
        console.warn("⚠️ Erro ao criar user_usage:", usageError);
        toast.warning("Falha ao registrar uso inicial (user_usage)");
      } else {
        console.log("✅ user_usage criado com sucesso.");
      }

      isActive = true;
    }

    const { data: planRows, error: planError } = await supabase
      .from("user_subscription")
      .select("status, plan_type")
      .eq("user_id", userId)
      .eq("status", "ativo");

    if (planError) {
      console.warn("⚠️ Erro ao buscar plano do usuário:", planError);
    }

    const planData = planRows?.[0] ?? null;
    const isFreePlan = !planData || planData.plan_type === 'free';

    if (!isActive) {
      if (planData) {
        console.log("⏫ Ativando conta com plano ativo");

        const { error: activationError } = await supabase
          .from("profiles")
          .update({ is_active: true })
          .eq("id", userId);

        if (activationError) {
          toast.error("Erro ao ativar conta automaticamente.");
          console.error("❌ Erro ao ativar conta:", activationError);
        } else {
          console.log("✅ Conta ativada automaticamente.");
        }
      } else {
        toast.error("Conta pendente de ativação pelo administrador.");
        console.warn("🔒 Usuário não tem plano e não está ativo.");
        await supabase.auth.signOut();
        throw new Error("Conta pendente de ativação pelo administrador");
      }
    }

    console.log("🎉 Login finalizado com sucesso.");
    return { user: data.user, session: data.session };

  } catch (error) {
    console.error("❌ Erro no login:", error);
    toast.error("Erro inesperado no login");
    throw error;
  }
};
