
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const resetPassword = async (email: string) => {
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

export const updatePassword = async (newPassword: string, navigate: Function) => {
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
