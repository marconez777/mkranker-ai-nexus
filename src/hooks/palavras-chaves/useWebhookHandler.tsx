
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PalavrasChavesFormData } from "@/types/palavras-chaves";
import { useWebhookApi } from "./useWebhookApi";
import { useResultFormatter } from "./useResultFormatter";
import { useSupabaseOperations } from "./useSupabaseOperations";

export const useWebhookHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  
  const { requestData, sendToWebhook } = useWebhookApi();
  const { formatResult } = useResultFormatter();
  const { saveAnalysis } = useSupabaseOperations();

  const onSubmit = async (data: PalavrasChavesFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setResultado("");
    
    try {
      const palavras = data.palavrasFundo.trim();
      
      if (!palavras) {
        toast({
          variant: "destructive",
          title: "Erro no formulário",
          description: "Por favor, insira pelo menos uma palavra-chave.",
        });
        return;
      }

      console.log("Preparando para enviar palavras-chave:");
      console.log(palavras);
      
      const webhookResponse = await sendToWebhook(palavras);
      console.log("Resposta processada do webhook:", webhookResponse);
      
      const formattedResult = formatResult(webhookResponse);
      setResultado(formattedResult);
      
      // Save to Supabase after successful webhook response
      const saved = await saveAnalysis(data.palavrasFundo, formattedResult);
      
      if (saved) {
        toast({
          title: "Sucesso!",
          description: "Análise de palavras-chave concluída e salva.",
        });
      } else {
        toast({
          title: "Sucesso parcial",
          description: "Análise concluída, mas não foi salva no histórico.",
        });
      }
    } catch (error) {
      console.error('Erro detalhado ao processar palavras-chave:', error);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: error instanceof Error 
          ? `Falha na comunicação: ${error.message}`
          : "Não foi possível obter resposta do webhook.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    resultado,
    requestData,
    errorMessage,
    onSubmit
  };
};
