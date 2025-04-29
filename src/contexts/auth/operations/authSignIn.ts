
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signIn = async (username: string, password: string, isAdminLogin = false) => {
  try {
    console.log("Iniciando login com email:", username);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password
    });
    
    if (error) {
      console.error("Erro de autenticação:", error);
      throw error;
    }
    
    // Log full response for debugging
    console.log("Resposta completa da autenticação:", data);
    
    if (!data.user) {
      console.error("Falha na autenticação: nenhum usuário retornado");
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }
    
    if (isAdminLogin) {
      // For admin login, we let the admin component handle the navigation
      console.log("Login admin bem-sucedido, retornando para o componente");
    } else {
      console.log("Login regular bem-sucedido, será redirecionado pela mudança no estado de autenticação");
    }
    
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};
