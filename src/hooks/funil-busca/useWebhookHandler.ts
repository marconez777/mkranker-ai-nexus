
import { useToast } from "@/hooks/use-toast";
import { FunilBuscaFormData } from "@/types/funil-busca";
import { useState } from "react";
import { sendToWebhook, parseWebhookResponse, saveAnalysisToDatabase } from "./utils/webhookUtils";

export const useWebhookHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (data: FunilBuscaFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setResultado("");
    
    try {
      console.log("Enviando dados para o webhook...");
      
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/f403ed72-e710-4b5d-a2bb-5c57679857d3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.log("Primeira tentativa falhou, tentando com no-cors...");
        await sendToWebhook(data);
        throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
      }

      console.log("Resposta recebida do webhook");
      const responseText = await response.text();
      console.log("Resposta bruta do webhook:", responseText);
      
      const resultText = parseWebhookResponse(responseText);
      console.log("Texto do resultado final:", resultText);
      
      const saved = await saveAnalysisToDatabase(data, resultText);
      
      setResultado(resultText);
      setErrorMessage("");
      setRetryCount(0);
      
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
  };

  return {
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit,
    handleRetry,
  };
};
