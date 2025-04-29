import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthOperations = () => {
  const navigate = useNavigate();

  const signIn = async (username: string, password: string, isAdminLogin = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });
      
      if (error) throw error;
      
      // Log full response for debugging
      console.log("Auth response:", data);
      
      if (!data.user) {
        throw new Error("Falha na autenticação: nenhum usuário retornado");
      }
      
      if (!isAdminLogin) {
        navigate('/dashboard');
        toast.success("Login realizado com sucesso. Bem-vindo de volta!");
      }
      // Don't navigate automatically if this is an admin login - that will be handled by the component
      
      return { user: data.user, session: data.session };
    } catch (error: any) {
      console.error("Login error:", error);
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
      navigate('/login');
      toast.success("Logout realizado com sucesso. Até logo!");
    } catch (error: any) {
      toast.error(`Erro ao fazer logout: ${error.message || "Ocorreu um erro inesperado"}`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail enviado! Verifique sua caixa de entrada para redefinir sua senha.");
    } catch (error: any) {
      toast.error(`Erro ao enviar e-mail: ${error.message || "Ocorreu um erro inesperado"}`);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Erro ao atualizar senha: ${error.message || "Ocorreu um erro inesperado"}`);
      throw error;
    }
  };

  const isUserAdmin = async (userId: string): Promise<boolean> => {
    if (!userId) {
      console.log("ID de usuário inválido na verificação de admin");
      return false;
    }
    
    try {
      console.log("Verificando status admin para usuário:", userId);
      
      let attempts = 0;
      const maxAttempts = 2;
      let lastError = null;
      
      while (attempts < maxAttempts) {
        try {
          const { data, error } = await supabase
            .rpc('is_admin', { user_id: userId });
          
          if (error) {
            console.error(`Tentativa ${attempts + 1}: Erro ao verificar status de administrador:`, error);
            lastError = error;
            attempts++;
            
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
            return false;
          }
          
          const isAdmin = !!data;
          console.log("Resultado da verificação de admin:", isAdmin, data);
          
          return isAdmin;
        } catch (queryError) {
          console.error(`Tentativa ${attempts + 1}: Erro ao verificar status de administrador:`, queryError);
          lastError = queryError;
          attempts++;
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          return false;
        }
      }
      
      console.error("Falha na verificação de admin após tentativas:", lastError);
      return false;
    } catch (error) {
      console.error("Erro ao verificar status de administrador:", error);
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
    
    if (error) {
      console.error("Erro ao verificar status de administrador:", error);
      return false;
    }
    
    const isAdmin = !!data;
    console.log("Resultado da verificação de admin (estática):", isAdmin, data);
    
    return isAdmin;
  } catch (error) {
    console.error("Erro ao verificar status de administrador (estático):", error);
    return false;
  }
};
