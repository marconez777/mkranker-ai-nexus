import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

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
      password,
    });

    if (error) {
      console.error("Erro de autenticação:", error);
      throw error;
    }

    if (!data.user) {
      console.error("Falha na autenticação: nenhum usuário retornado");
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }

    if (isAdminLogin) {
      console.log("Login admin bem-sucedido");
      return { user: data.user, session: data.session };
    }

    // Verifica status is_active apenas para fins informativos
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      console.warn("Erro ao buscar status is_active (login prossegue mesmo assim):", profileError);
    }

    console.log("Login regular bem-sucedido, status is_active:", profileData?.is_active);
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};
