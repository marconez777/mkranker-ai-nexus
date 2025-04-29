
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signOut = async (navigate: Function) => {
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
