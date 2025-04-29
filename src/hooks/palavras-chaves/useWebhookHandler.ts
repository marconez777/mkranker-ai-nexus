
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
  const [apiUrl] = useState<string>("https://mkseo77.app.n8n.cloud/webhook/palavra-chave");

  const handleWebhookSubmit = async (formData: PalavrasChavesFormData) => {
    if (!session?.user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para usar esta funcionalidade",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResultado("");

    try {
      // Tentar obter uma sessão atualizada antes de prosseguir
      const currentSession = await refreshSession();
      if (!currentSession) {
        throw new Error("Não foi possível obter uma sessão válida");
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

      // Garantir sessão atual antes de salvar
      const validSession = await refreshSession();
      if (!validSession) {
        throw new Error("Sessão expirada ao tentar salvar resultado");
      }
      
      const { error } = await supabase.from("palavras_chaves_analises").insert({
        user_id: validSession.user.id,
        palavras_chave: formData.palavraChave,
        resultado: resultado,
      });

      if (error) {
        console.error("Erro ao salvar análise:", error);
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
