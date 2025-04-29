import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthOperations = () => {
  const navigate = useNavigate();

  const signIn = async (username: string, password: string, isAdminLogin = false) => {
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
      
      // Don't navigate here - navigation should be handled by the auth state change
      // in components observing the session
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

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Registrando usuário:", { email, fullName });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      
      if (error) throw error;
      
      console.log("Resposta de registro:", data);
      
      if (data?.user) {
        toast.success("Conta criada com sucesso! Por favor, verifique seu e-mail para confirmar o cadastro.");
        return { user: data.user, session: data.session };
      } else {
        throw new Error("Falha ao registrar usuário: nenhum usuário retornado");
      }
    } catch (error: any) {
      console.error("Erro no registro:", error);
      toast.error(`Erro ao criar conta: ${error.message || "Ocorreu um erro inesperado"}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Navigate after successful sign out
      console.log("Logout successful, redirecting to login page");
      navigate('/login');
      toast.success("Logout realizado com sucesso. Até logo!");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(`Erro ao fazer logout: ${error.message || "Ocorreu um erro inesperado"}`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail enviado! Verifique sua caixa de entrada para redefinir sua senha.");
      return { data, error: null };
    } catch (error: any) {
      toast.error(`Erro ao enviar e-mail: ${error.message || "Ocorreu um erro inesperado"}`);
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      navigate('/dashboard');
      return { data, error: null };
    } catch (error: any) {
      toast.error(`Erro ao atualizar senha: ${error.message || "Ocorreu um erro inesperado"}`);
      return { data: null, error };
    }
  };

  const isUserAdmin = async (userId: string): Promise<boolean> => {
    if (!userId) {
      console.log("ID de usuário inválido na verificação de admin");
      return false;
    }
    
    try {
      console.log("Verificando status admin para usuário:", userId);
      
      // Adicione mais detalhes ao log para debug
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
      
      console.log("Resposta bruta da verificação de admin:", { data, error });
      
      if (error) {
        console.error("Erro ao verificar status de administrador:", error);
        return false;
      }
      
      const isAdmin = !!data;
      console.log("Resultado final da verificação de admin:", isAdmin, data);
      
      return isAdmin;
    } catch (error) {
      console.error("Exceção ao verificar status de administrador:", error);
      return false;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isUserAdmin
  };
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.log("ID de usuário inválido na verificação de admin");
    return false;
  }
  
  try {
    console.log("Verificando status admin para usuário (versão estática):", userId);
    
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    console.log("Resposta bruta da verificação estática de admin:", { data, error });
    
    if (error) {
      console.error("Erro ao verificar status de administrador:", error);
      return false;
    }
    
    const isAdmin = !!data;
    console.log("Resultado final da verificação de admin (estática):", isAdmin, data);
    
    return isAdmin;
  } catch (error) {
    console.error("Exceção ao verificar status de administrador (estático):", error);
    return false;
  }
};
