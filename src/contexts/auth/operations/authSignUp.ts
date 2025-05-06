
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
      const { error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: data.user.id,
    full_name: fullName,
    is_active: true, // ativa automaticamente para plano gratuito
    plan_type: 'free' // já registra o plano free explicitamente
  });
      
      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        throw new Error(`Erro ao criar perfil: ${profileError.message}`);
      }
      
      // Inserir na tabela de roles como 'user'
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: 'user'
        });
      
      if (roleError) {
        console.error("Erro ao definir papel de usuário:", roleError);
        throw new Error(`Erro ao definir papel de usuário: ${roleError.message}`);
      }
      
      // Deslogar o usuário após o cadastro para evitar acesso
      await supabase.auth.signOut();
      
      toast.success("Conta criada com sucesso! Faça login para começar a usar a plataforma.");
      return { user: data.user, session: null };
    } else {
      throw new Error("Falha ao registrar usuário: nenhum usuário retornado");
    }
  } catch (error: any) {
    console.error("Erro no registro:", error);
    
    if (error.message?.includes("already registered")) {
      toast.error("Este email já está registrado. Por favor, use outro email ou faça login.");
    } else {
      toast.error(`Erro ao criar conta: ${error.message || "Ocorreu um erro inesperado"}`);
    }
    
    throw error;
  }
};
