import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunilBuscaFormData, funilBuscaSchema } from "@/types/funil-busca";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useFunilBusca = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const methods = useForm<FunilBuscaFormData>({
    resolver: zodResolver(funilBuscaSchema),
    defaultValues: {
      microNicho: "",
      publicoAlvo: "",
      segmento: ""
    }
  });

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
        
        // Make sure we don't return null
        return data || [];
      } catch (err) {
        console.error("Failed to fetch funil history:", err);
        return [];
      }
    },
    staleTime: 30000 // Data is considered fresh for 30 seconds
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

  const sendToWebhook = async (data: FunilBuscaFormData) => {
    try {
      console.log("Enviando dados para o webhook:", data);
      
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/f403ed72-e710-4b5d-a2bb-5c57679857d3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(data)
      });
      
      console.log("Dados enviados para webhook com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao enviar dados para webhook:", error);
      return false;
    }
  };

  const onSubmit = async (data: FunilBuscaFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setResultado(""); // Clear previous results
    
    try {
      console.log("Enviando dados para o webhook...");
      
      // First try with normal fetch
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/f403ed72-e710-4b5d-a2bb-5c57679857d3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // If normal fetch fails, try with no-cors mode
        console.log("Primeira tentativa falhou, tentando com no-cors...");
        await sendToWebhook(data);
        throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
      }

      console.log("Resposta recebida do webhook");
      const responseText = await response.text();
      console.log("Resposta bruta do webhook:", responseText);
      
      // Parse response text safely
      let resultText = "";
      try {
        const responseData = JSON.parse(responseText);
        console.log("Dados da resposta parseados:", responseData);
        
        if (typeof responseData === 'string') {
          resultText = responseData;
        } else if (responseData && responseData.message) {
          resultText = responseData.message;
        } else if (responseData && responseData.output) {
          resultText = responseData.output;
        } else {
          resultText = JSON.stringify(responseData);
        }
      } catch (parseError) {
        console.log("Resposta não é JSON válido, usando texto bruto");
        resultText = responseText;
      }
      
      console.log("Texto do resultado final:", resultText);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("Usuário não autenticado");
          toast({
            variant: "destructive",
            title: "Erro de autenticação",
            description: "Você precisa estar logado para salvar análises.",
          });
          
          // Still show the result but don't save
          setResultado(resultText);
          setErrorMessage("");
          setRetryCount(0);
          return;
        }
        
        // Save to Supabase
        const { error: saveError } = await supabase
          .from('analise_funil_busca')
          .insert({
            micro_nicho: data.microNicho,
            publico_alvo: data.publicoAlvo,
            segmento: data.segmento,
            resultado: resultText,
            user_id: user.id
          });

        if (saveError) {
          console.error("Erro ao salvar no Supabase:", saveError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "A análise foi gerada mas não foi possível salvá-la no histórico.",
          });
        } else {
          console.log("Análise salva com sucesso no banco de dados");
        }
      } catch (supabaseError) {
        console.error("Erro ao salvar no Supabase:", supabaseError);
        // Continue execution even if saving to Supabase fails
        // We still want to show the result from the webhook
      }
      
      setResultado(resultText);
      setErrorMessage("");
      setRetryCount(0);
      
      // Immediately refetch the history after a successful submission
      try {
        console.log("Tentando atualizar a lista de análises...");
        await refetchAnalises();
        console.log("Lista de análises atualizada com sucesso");
      } catch (refetchError) {
        console.error("Erro ao atualizar a lista de análises:", refetchError);
        // Continue execution even if refetching fails
      }
      
      toast({
        title: "Sucesso!",
        description: "Sua análise foi processada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setResultado("");
      setErrorMessage("Não foi possível conectar ao servidor do webhook. O servidor pode estar indisponível ou existe um problema de conexão. Tente novamente mais tarde.");
      
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Ocorreu um erro ao enviar os dados. O servidor pode estar indisponível.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setErrorMessage("");
    methods.handleSubmit(onSubmit)();
  };

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
    methods,
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit: methods.handleSubmit(onSubmit),
    handleRetry,
    handleDelete,
    handleRename,
    analises,
    refetchHistorico
  };
};
