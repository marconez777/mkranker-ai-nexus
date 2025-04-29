
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
    
    // Para login admin, não verificamos o status ativo
    if (isAdminLogin) {
      console.log("Login admin bem-sucedido, retornando para o componente");
      return { user: data.user, session: data.session };
    }
    
    // Para login regular, verificar se a conta está ativa
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error("Erro ao verificar status da conta:", profileError);
      // Deslogar o usuário
      await supabase.auth.signOut();
      throw new Error("Erro ao verificar status da conta");
    }
    
    if (profileData && profileData.is_active === false) {
      console.log("Conta pendente de ativação");
      // Deslogar o usuário
      await supabase.auth.signOut();
      throw new Error("Conta pendente de ativação pelo administrador");
    }
    
    console.log("Login regular bem-sucedido, será redirecionado pela mudança no estado de autenticação");
    
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};
