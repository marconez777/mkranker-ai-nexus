
import { supabase } from '@/integrations/supabase/client';

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.log("ID de usuário inválido na verificação de admin");
    return false;
  }
  
  try {
    console.log("Verificando status admin para usuário:", userId);
    
    // Buscar o papel do usuário diretamente usando RPC
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error("Erro ao verificar status de administrador:", error);
      return false;
    }
    
    // A função RPC retorna um booleano diretamente
    const isAdmin = !!data;
    console.log("Resultado da verificação de admin:", isAdmin);
    
    return isAdmin;
  } catch (error) {
    console.error("Exceção ao verificar status de administrador:", error);
    return false;
  }
};
