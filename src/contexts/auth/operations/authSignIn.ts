
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
    
    // Log full response for debugging
    console.log("Resposta completa da autenticação:", data);
    
    if (!data.user) {
      console.error("Falha na autenticação: nenhum usuário retornado");
      throw new Error("Falha na autenticação: nenhum usuário retornado");
    }
    
    // Para login admin, não verificamos o status ativo ou assinatura
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
    
    if (!profileData || profileData.is_active === false) {
      console.log("Conta pendente de ativação");
      // Deslogar o usuário
      await supabase.auth.signOut();
      throw new Error("Conta pendente de ativação pelo administrador");
    }
    
    // REMOVIDO: Verificação de assinatura ativa
    // Agora usuários sem assinatura ou com assinatura vencida podem acessar o sistema
    
    console.log("Login regular bem-sucedido, será redirecionado pela mudança no estado de autenticação");
    
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};
