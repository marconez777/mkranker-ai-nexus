
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
    
    // NOVA VERIFICAÇÃO: Checar assinatura ativa
    const currentDate = new Date().toISOString();
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscription')
      .select('*, plans(*)')
      .eq('user_id', data.user.id)
      .eq('status', 'ativo')
      .gte('vencimento', currentDate)
      .maybeSingle();
    
    if (subscriptionError) {
      console.error("Erro ao verificar assinatura:", subscriptionError);
    }
    
    // Se não encontrar assinatura válida e não for um usuário administrador
    if (!subscriptionData) {
      // Verificar se o usuário é admin antes de fazer logout
      const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: data.user.id });
      
      if (!isAdmin) {
        console.log("Assinatura inativa ou vencida. Redirecionando para checkout.");
        // Deslogar o usuário
        await supabase.auth.signOut();
        
        if (navigate) {
          navigate('/checkout', { 
            state: { 
              message: "Sua assinatura está inativa ou vencida. Renove seu plano para acessar a plataforma." 
            } 
          });
        }
        
        throw new Error("Assinatura inativa ou vencida");
      }
    }
    
    console.log("Login regular bem-sucedido, será redirecionado pela mudança no estado de autenticação");
    
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};
