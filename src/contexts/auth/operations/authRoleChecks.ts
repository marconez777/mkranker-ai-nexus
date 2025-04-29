
import { supabase } from '@/integrations/supabase/client';

export const isUserAdmin = async (userId: string): Promise<boolean> => {
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
