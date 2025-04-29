
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
  const [isLoading, setIsLoading] = useState(false);
  const { session, refreshSession } = useAuth();
  const { toast } = useToast();

  const fetchAnalises = async () => {
    if (!session?.user) {
      console.log("No session found, cannot fetch history");
      return;
    }

    setIsLoading(true);
    try {
      // Refresh the session first to avoid JWT expired errors
      await refreshSession();
      
      console.log("Fetching history for user:", session.user.id);
      const { data, error } = await supabase
        .from("palavras_chaves_analises")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching analyses:", error);
        throw error;
      }
      
      console.log("Fetched analyses:", data);
      setAnalises(data as PalavrasChavesAnalise[]);
    } catch (error: any) {
      console.error("Error fetching analyses:", error);
      
      // Retry com uma nova sessão se o JWT expirou
      if (error.message?.includes("JWT expired") || error.message?.includes("JWT")) {
        console.log("JWT expired, attempting to refresh session");
        try {
          await refreshSession();
          // Tentar buscar novamente após atualização da sessão
          const { data, error: refreshError } = await supabase
            .from("palavras_chaves_analises")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });
            
          if (refreshError) {
            console.error("Error after refresh attempt:", refreshError);
            throw refreshError;
          }
          
          console.log("Retry successful, fetched analyses:", data);
          setAnalises(data as PalavrasChavesAnalise[]);
        } catch (refreshError) {
          console.error("Error after refresh attempt:", refreshError);
          toast({
            title: "Erro de sessão",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico de análises",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Refresh session before delete operation
      await refreshSession();
      
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
      // Refresh session before rename operation
      await refreshSession();
      
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
    isLoading,
    refetchHistorico: fetchAnalises,
    handleDelete,
    handleRename,
  };
};
