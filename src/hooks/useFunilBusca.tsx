
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
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

  const { data: analises, refetch: refetchAnalises } = useQuery({
    queryKey: ['analises-funil'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analise_funil_busca')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

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
      const responseData = await response.json();
      console.log("Dados da resposta:", responseData);
      
      // Get the result string from the response
      let resultText = "";
      if (typeof responseData === 'string') {
        resultText = responseData;
      } else if (responseData && responseData.message) {
        resultText = responseData.message;
      } else if (responseData && responseData.output) {
        resultText = responseData.output;
      } else {
        resultText = JSON.stringify(responseData);
      }
      
      console.log("Texto do resultado:", resultText);
      
      try {
        // Save to Supabase
        const { error: saveError } = await supabase
          .from('analise_funil_busca')
          .insert({
            micro_nicho: data.microNicho,
            publico_alvo: data.publicoAlvo,
            segmento: data.segmento,
            resultado: resultText,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (saveError) {
          console.error("Erro ao salvar no Supabase:", saveError);
          throw saveError;
        }
      } catch (supabaseError) {
        console.error("Erro ao salvar no Supabase:", supabaseError);
        // Continue execution even if saving to Supabase fails
        // We still want to show the result from the webhook
      }
      
      setResultado(resultText);
      setErrorMessage("");
      setRetryCount(0);
      
      try {
        await refetchAnalises();
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

  return {
    methods,
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit: methods.handleSubmit(onSubmit),
    handleRetry,
    analises
  };
};
