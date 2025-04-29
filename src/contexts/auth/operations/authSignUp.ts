
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signUp = async (email: string, password: string, fullName: string) => {
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
