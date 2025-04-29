
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

  // Melhorando o método isUserAdmin para evitar problemas de cache e política de acesso
  const isUserAdmin = async (userId: string): Promise<boolean> => {
    if (!userId) {
      console.error("ID de usuário inválido na verificação de admin");
      return false;
    }
    
    try {
      console.log("Verificando status admin para usuário:", userId);
      
      // Primeira abordagem: tentar atualizar o token para garantir que ele é válido
      try {
        await supabase.auth.refreshSession();
      } catch (refreshError) {
        console.log("Erro ao atualizar token (não crítico, continuando):", refreshError);
      }
      
      // Consulta direta à tabela user_roles com retentativas
      let attempts = 0;
      const maxAttempts = 2;
      
      while (attempts < maxAttempts) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          
          if (error) {
            console.error(`Tentativa ${attempts + 1}: Erro ao verificar status de administrador:`, error);
            attempts++;
            
            if (attempts < maxAttempts) {
              // Esperar um momento antes de tentar novamente
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
            return false;
          }
          
          // Verificar se algum resultado foi retornado
          const isAdmin = !!data;
          console.log("Resultado da verificação de admin:", isAdmin, data);
          
          return isAdmin;
        } catch (queryError) {
          console.error(`Tentativa ${attempts + 1}: Erro ao verificar status de administrador:`, queryError);
          attempts++;
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          return false;
        }
      }
      
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
