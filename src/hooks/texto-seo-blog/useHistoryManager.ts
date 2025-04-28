
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TextoSeoBlog = {
  id: string;
  user_id: string;
  tema: string;
  palavra_chave: string;
  palavras_relacionadas: string[];
  observacoes: string | null;
  resultado: string;
  created_at: string;
  updated_at: string;
}

export const useHistoryManager = () => {
  const { toast } = useToast();

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['texto-seo-blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('texto_seo_blog')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching history:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar histórico",
          description: "Não foi possível carregar o histórico de análises.",
        });
        return [];
      }
      
      return (data || []) as TextoSeoBlog[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('texto_seo_blog')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting analysis:", error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Não foi possível excluir a análise.",
        });
        return;
      }

      await refetchAnalises();
      
      toast({
        title: "Análise excluída",
        description: "A análise foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao tentar excluir a análise.",
      });
    }
  };

  const handleRename = async (id: string, newTema: string) => {
    try {
      const { error } = await supabase
        .from('texto_seo_blog')
        .update({ tema: newTema })
        .eq('id', id);

      if (error) {
        console.error("Error renaming analysis:", error);
        toast({
          variant: "destructive",
          title: "Erro ao renomear",
          description: "Não foi possível renomear a análise.",
        });
        return;
      }

      await refetchAnalises();
      
      toast({
        title: "Análise renomeada",
        description: "A análise foi renomeada com sucesso.",
      });
    } catch (error) {
      console.error("Error in handleRename:", error);
      toast({
        variant: "destructive",
        title: "Erro ao renomear",
        description: "Ocorreu um erro ao tentar renomear a análise.",
      });
    }
  };

  const refetchHistorico = async () => {
    try {
      await refetchAnalises();
      return true;
    } catch (error) {
      console.error("Error refetching history:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o histórico.",
      });
      return false;
    }
  };

  return {
    analises,
    handleDelete,
    handleRename,
    refetchHistorico,
  };
};
