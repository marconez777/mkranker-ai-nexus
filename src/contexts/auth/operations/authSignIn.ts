import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

export const signIn = async (email: string, password: string, isAdminLogin = false, navigate?: NavigateFunction) => {
  try {
    console.log("Iniciando login com email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password
    });
    
    if (error) {
      console.error("Erro de autenticação:", error);
      throw error;
    }

    console.log("Resposta completa da autenticação:", data);

    if (!data.user) {
      console.error("Falha na autenticação: nenhum usuário retornado");
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }

    // Se for login admin, retorna direto
    if (isAdminLogin) {
      console.log("Login admin bem-sucedido, retornando para o componente");
      return { user: data.user, session: data.session };
    }

    // 👇 Removido: bloqueio por is_active
    // Se você quiser apenas logar e depois controlar funcionalidades pelo is_active, controle isso no front

    console.log("Login regular bem-sucedido, será redirecionado pela mudança no estado de autenticação");

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};
