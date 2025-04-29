
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
  const [webhookUrl, setWebhookUrl] = useState<string>("https://mkseo77.app.n8n.cloud/webhook-test/palavras");

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
      // Usando a URL do webhook diretamente ao invés de buscar do banco de dados
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

      const data = await response.json();
      console.log("Resposta do webhook:", data);
      
      if (data && data.result) {
        setResultado(data.result);

        // Salvar no banco de dados
        const { error } = await supabase.from("palavras_chaves_analises").insert({
          user_id: session.user.id,
          palavras_chave: formData.palavrasChave,
          resultado: data.result,
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
        throw new Error("Resposta do webhook inválida");
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
