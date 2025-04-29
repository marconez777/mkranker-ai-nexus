
import { useState, useEffect, useCallback } from "react";
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { session, refreshSession } = useAuth();
  const { toast } = useToast();

  const fetchAnalises = useCallback(async () => {
    if (!session?.user) {
      console.log("No session found, cannot fetch history");
      setAnalises([]);
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    
    try {
      // First, ensure we have a fresh session
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
      
      console.log("Fetched analyses:", data?.length || 0, "records");
      setAnalises(data as PalavrasChavesAnalise[]);
    } catch (error: any) {
      console.error("Error fetching analyses:", error);
      setFetchError(error.message);
      
      // Retry with a new session if JWT expired
      if (error.message?.includes("JWT expired") || error.message?.includes("JWT")) {
        console.log("JWT expired, attempting to refresh session and retry");
        try {
          const newSession = await refreshSession();
          
          if (!newSession) {
            console.error("Failed to refresh session");
            toast({
              title: "Erro de sessão",
              description: "Sua sessão expirou. Por favor, faça login novamente.",
              variant: "destructive",
            });
            return;
          }
          
          // Try fetching again after session update
          const { data, error: refreshError } = await supabase
            .from("palavras_chaves_analises")
            .select("*")
            .eq("user_id", newSession.user.id)
            .order("created_at", { ascending: false });
            
          if (refreshError) {
            console.error("Error after refresh attempt:", refreshError);
            throw refreshError;
          }
          
          console.log("Retry successful, fetched analyses:", data?.length || 0, "records");
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
  }, [session?.user, refreshSession, toast]);

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
      
      // If JWT error, try refreshing once more
      if (error.message?.includes("JWT")) {
        try {
          await refreshSession();
          const { error: retryError } = await supabase
            .from("palavras_chaves_analises")
            .delete()
            .eq("id", id);
            
          if (retryError) {
            throw retryError;
          }
          
          toast({
            title: "Sucesso",
            description: "Análise excluída com sucesso",
          });
          
          fetchAnalises();
          return;
        } catch (retryErr) {
          console.error("Retry failed:", retryErr);
        }
      }
      
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
      
      // If JWT error, try refreshing once more
      if (error.message?.includes("JWT")) {
        try {
          await refreshSession();
          const { error: retryError } = await supabase
            .from("palavras_chaves_analises")
            .update({ palavras_chave: palavrasChave })
            .eq("id", id);
            
          if (retryError) {
            throw retryError;
          }
          
          toast({
            title: "Sucesso",
            description: "Análise renomeada com sucesso",
          });
          
          fetchAnalises();
          return;
        } catch (retryErr) {
          console.error("Retry failed:", retryErr);
        }
      }
      
      toast({
        title: "Erro",
        description: "Não foi possível renomear a análise",
        variant: "destructive",
      });
    }
  };

  // Initial fetch when component is mounted
  useEffect(() => {
    if (session?.user) {
      fetchAnalises();
    } else {
      // Clear analyses if no session
      setAnalises([]);
    }
  }, [session?.user, fetchAnalises]);

  return {
    analises,
    isLoading,
    refetchHistorico: fetchAnalises,
    handleDelete,
    handleRename,
    fetchError
  };
};
