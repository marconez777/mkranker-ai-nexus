
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export const useHistoryManager = () => {
  const { toast } = useToast();

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['palavras-chaves-history'],
    queryFn: async () => {
      console.log("Fetching palavras-chaves history...");
      try {
        const { error: sessionError } = await supabase.auth.refreshSession();
        if (sessionError) {
          console.error("Error refreshing session:", sessionError);
        }
        
        const { data, error } = await supabase
          .from('palavras_chaves')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching palavras-chaves history:", error);
          toast({
            variant: "destructive",
            title: "Erro ao buscar histórico",
            description: "Não foi possível acessar o histórico de análises.",
          });
          return [];
        }
        
        console.log("Successfully retrieved palavras-chaves history:", data?.length || 0, "entries");
        return data || [];
      } catch (err) {
        console.error("Failed to fetch palavras-chaves history:", err);
        return [];
      }
    },
    staleTime: 30000,
    retry: 1
  });

  const refetchHistorico = useCallback(async () => {
    console.log("Manually refetching palavras-chaves history...");
    try {
      const { error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Error refreshing session during refetch:", sessionError);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Sua sessão expirou. Por favor, recarregue a página.",
        });
        return;
      }
      
      await refetchAnalises();
      console.log("Manual refetch completed");
    } catch (error) {
      console.error("Error during manual refetch:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o histórico. Tente novamente.",
      });
    }
  }, [refetchAnalises, toast]);

  const handleDelete = async (id: string) => {
    try {
      await supabase.auth.refreshSession();
      
      const { error } = await supabase
        .from('palavras_chaves')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refetchAnalises();
      
      toast({
        title: "Sucesso!",
        description: "Análise excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a análise. Tente novamente.",
      });
    }
  };

  const handleRename = async (id: string, newPalavrasFundo: string[]) => {
    try {
      await supabase.auth.refreshSession();
      
      const { error } = await supabase
        .from('palavras_chaves')
        .update({ palavras_fundo: newPalavrasFundo })
        .eq('id', id);

      if (error) throw error;

      await refetchAnalises();
      
      toast({
        title: "Sucesso!",
        description: "Análise renomeada com sucesso.",
      });
    } catch (error) {
      console.error("Error renaming analysis:", error);
      toast({
        variant: "destructive",
        title: "Erro ao renomear",
        description: "Não foi possível renomear a análise. Tente novamente.",
      });
    }
  };

  return {
    analises,
    refetchHistorico,
    handleDelete,
    handleRename,
  };
};
