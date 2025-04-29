
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PalavrasChavesFormData } from "./useFormManager";

export const useWebhookHandler = (
  setIsLoading: (value: boolean) => void,
  setResultado: (value: string) => void,
  setRetryCount: React.Dispatch<React.SetStateAction<number>>,
  refetchHistorico: () => void
) => {
  const { session, refreshSession } = useAuth();
  const { toast } = useToast();
  // Hardcode the API URL to avoid reference to webhooks in the frontend
  const [apiUrl] = useState<string>("https://mkseo77.app.n8n.cloud/webhook/palavra-chave");
  const [apiRequestInProgress, setApiRequestInProgress] = useState(false);

  const handleWebhookSubmit = async (formData: PalavrasChavesFormData) => {
    // Prevent multiple concurrent submissions
    if (apiRequestInProgress) {
      toast({
        title: "Processamento em andamento",
        description: "Por favor, aguarde o término da operação atual",
        variant: "default",
      });
      return;
    }

    if (!session?.user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para usar esta funcionalidade",
        variant: "destructive",
      });
      return;
    }

    setApiRequestInProgress(true);
    setIsLoading(true);
    setResultado("");

    try {
      // Try to get an updated session before proceeding
      const currentSession = await refreshSession();
      if (!currentSession) {
        throw new Error("Não foi possível obter uma sessão válida. Tente fazer login novamente.");
      }
      
      const payload = {
        palavras_chave: [formData.palavraChave.trim()],
      };

      console.log("Enviando solicitação para API");
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ao processar solicitação: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Resposta da API recebida");
      
      let resultado = "Não foi possível gerar palavras-chave relacionadas.";
      let data = null;
      
      if (responseText && responseText.trim() !== '') {
        try {
          data = JSON.parse(responseText);
          
          if (data && data.output) {
            resultado = data.output;
          } else if (data && typeof data === 'string') {
            resultado = data;
          } else if (Array.isArray(data)) {
            resultado = data.join('\n');
          }
        } catch (parseError) {
          console.error("Erro ao parsear resposta JSON:", parseError);
          resultado = responseText;
        }
      }
      
      setResultado(resultado);

      toast({
        title: "Sucesso",
        description: "Processamento da solicitação concluído",
      });

      // Ensure valid session before saving
      const validSession = await refreshSession();
      if (!validSession) {
        throw new Error("Sessão expirada ao tentar salvar resultado");
      }
      
      // Try to insert the result with multiple retry attempts
      let saveError = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const { error } = await supabase.from("palavras_chaves_analises").insert({
            user_id: validSession.user.id,
            palavras_chave: formData.palavraChave,
            resultado: resultado,
          });
          
          if (!error) {
            saveError = null;
            break; // Successfully inserted, exit loop
          }
          
          saveError = error;
          console.error(`Tentativa ${attempt}: Erro ao salvar análise:`, error);
          
          // If JWT error, try refreshing session once more
          if (error.message?.includes("JWT")) {
            await refreshSession();
          }
          
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          saveError = err;
          console.error(`Tentativa ${attempt}: Exceção ao salvar análise:`, err);
        }
      }

      if (saveError) {
        console.error("Erro final ao salvar análise:", saveError);
        toast({
          title: "Atenção",
          description: "Resultado gerado, mas não foi possível salvá-lo no histórico",
          variant: "default",
        });
      } else {
        await refetchHistorico();
      }
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
      setApiRequestInProgress(false);
    }
  };

  const handleRetry = (getValues: () => PalavrasChavesFormData) => {
    const formValues = getValues();
    handleWebhookSubmit(formValues);
  };

  return {
    handleWebhookSubmit,
    handleRetry,
  };
};
