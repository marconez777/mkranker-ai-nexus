
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
  const [webhookUrl, setWebhookUrl] = useState<string>("https://mkseo77.app.n8n.cloud/webhook/palavras");

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
        palavras_chave: formData.palavrasChave.split("\n").filter(Boolean),
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

      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Resposta do webhook não é JSON válido");
      }
      
      // Get the text first to debug any parsing issues
      const responseText = await response.text();
      console.log("Resposta bruta do webhook:", responseText);
      
      // Parse the response if it exists
      if (!responseText) {
        throw new Error("Resposta vazia do webhook");
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Resposta do webhook (parseada):", data);
      } catch (parseError) {
        console.error("Erro ao parsear resposta JSON:", parseError);
        throw new Error("Resposta do webhook não é um JSON válido");
      }
      
      if (data && data.result) {
        const resultado = data.result;
        setResultado(resultado);
        console.log("Resultado final do webhook:", resultado);

        // Mostrar toast com sucesso
        toast({
          title: "Sucesso",
          description: "Palavras-chave relacionadas geradas com sucesso",
        });

        // Salvar no banco de dados
        const { error } = await supabase.from("palavras_chaves_analises").insert({
          user_id: session.user.id,
          palavras_chave: formData.palavrasChave,
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
      } else {
        throw new Error("Resposta do webhook inválida ou sem campo 'result'");
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
