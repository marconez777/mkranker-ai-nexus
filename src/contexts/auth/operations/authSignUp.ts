
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
      // Inserir no perfil com is_active: false (pendente)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        is_active: false, // usuário começa pendente
      });
      
      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
      }
      
      // Inserir na tabela de roles como 'user'
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: 'user'
      });
      
      if (roleError) {
        console.error("Erro ao definir papel de usuário:", roleError);
      }
      
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
