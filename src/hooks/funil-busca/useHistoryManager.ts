
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHistoryManager = () => {
  const [analises, setAnalises] = useState<any[]>([]);
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
      // Try to refresh the session first to avoid JWT expired errors
      await refreshSession();
      
      console.log("Fetching funil-busca history for user:", session.user.id);
      const { data, error } = await supabase
        .from("analise_funil_busca")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched funil analyses:", data);
      setAnalises(data || []);
    } catch (error: any) {
      console.error("Error fetching funil analyses:", error);
      
      // Check if error is due to expired JWT
      if (error.message?.includes("JWT expired")) {
        try {
          await refreshSession();
          // Try fetching again after session refresh
          const { data, error: refreshError } = await supabase
            .from("analise_funil_busca")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });
            
          if (refreshError) throw refreshError;
          setAnalises(data || []);
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
      const { error } = await supabase
        .from("analise_funil_busca")
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

  const handleRename = async (id: string, microNicho: string) => {
    try {
      const { error } = await supabase
        .from("analise_funil_busca")
        .update({ micro_nicho: microNicho })
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
