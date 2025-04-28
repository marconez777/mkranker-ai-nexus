
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
      
      if (!isAdminLogin) {
        navigate('/dashboard');
        toast.success("Login realizado com sucesso. Bem-vindo de volta!");
      }
      // Não navegamos automaticamente se for um login admin - isso será tratado pelo componente específico
      
      return data;
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
      console.error("ID de usuário inválido na verificação de admin");
      return false;
    }
    
    try {
      console.log("Verificando status admin para usuário:", userId);
      
      // Tentativas máximas para lidar com possíveis erros temporários
      const maxAttempts = 2;
      let attempt = 0;
      
      while (attempt < maxAttempts) {
        attempt++;
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          
          if (error) {
            console.error(`Erro ao verificar status de administrador (tentativa ${attempt}):`, error);
            if (attempt >= maxAttempts) throw error;
            await new Promise(resolve => setTimeout(resolve, 500)); // Pequeno delay antes de tentar novamente
            continue;
          }
          
          const isAdmin = !!data;
          console.log(`Resultado da verificação de admin (tentativa ${attempt}):`, isAdmin, data);
          return isAdmin;
        } catch (innerError) {
          console.error(`Erro na tentativa ${attempt}:`, innerError);
          if (attempt >= maxAttempts) throw innerError;
          await new Promise(resolve => setTimeout(resolve, 500));
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
