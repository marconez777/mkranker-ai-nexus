
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
  const { session } = useAuth();
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>("https://mkseo77.app.n8n.cloud/webhook/palavra-chave");

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
      const payload = {
        palavras_chave: [formData.palavraChave.trim()],
      };

      console.log("Enviando solicitação para webhook:", webhookUrl);
      console.log("Payload:", payload);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ao chamar webhook: ${response.status}`);
      }

      // Get the text first to debug any parsing issues
      const responseText = await response.text();
      console.log("Resposta bruta do webhook:", responseText);
      
      let resultado = "Não foi possível gerar palavras-chave relacionadas.";
      let data = null;
      
      // Only try to parse if there's actual content
      if (responseText && responseText.trim() !== '') {
        try {
          data = JSON.parse(responseText);
          console.log("Resposta do webhook (parseada):", data);
          
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
      } else {
        console.log("Resposta vazia recebida, usando resultado padrão");
      }
      
      // Set the result regardless of format
      setResultado(resultado);
      console.log("Resultado final do webhook:", resultado);

      // Mostrar toast com sucesso
      toast({
        title: "Sucesso",
        description: "Processamento da solicitação concluído",
      });

      // Salvar no banco de dados
      const { error } = await supabase.from("palavras_chaves_analises").insert({
        user_id: session.user.id,
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
        refetchHistorico();
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
