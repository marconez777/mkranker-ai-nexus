
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export const useHistoryManager = () => {
  const { toast } = useToast();

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['analises-funil'],
    queryFn: async () => {
      console.log("Fetching funil de busca history...");
      try {
        const { data, error } = await supabase
          .from('analise_funil_busca')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching funil history:", error);
          toast({
            variant: "destructive",
            title: "Erro ao buscar histórico",
            description: "Não foi possível acessar o histórico de análises.",
          });
          return [];
        }
        
        console.log("Successfully retrieved funil history:", data?.length || 0, "entries");
        return data || [];
      } catch (err) {
        console.error("Failed to fetch funil history:", err);
        return [];
      }
    },
    staleTime: 30000
  });

  const refetchHistorico = useCallback(async () => {
    console.log("Manually refetching funil history...");
    try {
      await refetchAnalises();
      console.log("Manual refetch completed");
    } catch (error) {
      console.error("Error during manual refetch:", error);
    }
  }, [refetchAnalises]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analise_funil_busca')
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

  const handleRename = async (id: string, newMicroNicho: string) => {
    try {
      const { error } = await supabase
        .from('analise_funil_busca')
        .update({ micro_nicho: newMicroNicho })
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
