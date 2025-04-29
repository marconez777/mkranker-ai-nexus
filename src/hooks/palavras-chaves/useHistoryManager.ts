
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PalavrasChavesAnalise = {
  id: string;
  user_id: string;
  palavras_chave: string;
  resultado: string;
  created_at: string;
};

export const useHistoryManager = () => {
  const [analises, setAnalises] = useState<PalavrasChavesAnalise[] | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchAnalises = async () => {
    if (!session?.user) return;

    try {
      // Using the new palavras_chaves_analises table
      const { data, error } = await supabase
        .from("palavras_chaves_analises")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalises(data as PalavrasChavesAnalise[]);
    } catch (error: any) {
      console.error("Erro ao buscar análises:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de análises",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("palavras_chaves_analises")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Análise excluída com sucesso",
      });

      fetchAnalises();
    } catch (error: any) {
      console.error("Erro ao excluir análise:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a análise",
        variant: "destructive",
      });
    }
  };

  const handleRename = async (id: string, palavrasChave: string) => {
    try {
      const { error } = await supabase
        .from("palavras_chaves_analises")
        .update({ palavras_chave: palavrasChave })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Análise renomeada com sucesso",
      });

      fetchAnalises();
    } catch (error: any) {
      console.error("Erro ao renomear análise:", error);
      toast({
        title: "Erro",
        description: "Não foi possível renomear a análise",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchAnalises();
    }
  }, [session?.user]);

  return {
    analises,
    refetchHistorico: fetchAnalises,
    handleDelete,
    handleRename,
  };
};
