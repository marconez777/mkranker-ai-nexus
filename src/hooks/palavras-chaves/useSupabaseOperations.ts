
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseOperations = () => {
  const { toast } = useToast();
  
  const saveAnalysis = async (palavrasFundo: string, formattedResult: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        return false;
      }
      
      const palavrasArray = palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(Boolean);
      
      const { error } = await supabase
        .from('palavras_chaves')
        .insert({
          palavras_fundo: palavrasArray,
          resultado: formattedResult,
          user_id: user.id
        });

      if (error) {
        console.error("Error saving to Supabase:", error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "A análise foi gerada mas não foi possível salvá-la no histórico.",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error with Supabase operation:", error);
      return false;
    }
  };

  return { saveAnalysis };
};
