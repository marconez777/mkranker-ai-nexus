
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PalavrasChavesFormData, palavrasChavesSchema } from "@/types/palavras-chaves";
import { useHistoryManager } from "./palavras-chaves/useHistoryManager";

export const usePalavrasChavesWebhook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [requestData, setRequestData] = useState("");
  const { toast } = useToast();
  const { analises, refetchHistorico, handleDelete, handleRename } = useHistoryManager();

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const sendToWebhook = async (data: PalavrasChavesFormData) => {
    try {
      // Preparar dados para enviar ao webhook
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      console.log('Enviando para o webhook com dados:', {
        palavrasFundo: palavrasFundoArray,
        timestamp: new Date().toISOString()
      });
      
      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook-test/palavras-chave';
      
      // Using fetch without no-cors mode to get a proper response
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          palavrasFundo: palavrasFundoArray, // Send as array instead of string
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the response as JSON
      const webhookResponse = await response.json();
      console.log('Resposta completa do webhook:', webhookResponse);
      
      return webhookResponse;
      
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      throw error; // Propagate the error so it can be handled in onSubmit
    }
  };

  const onSubmit = async (data: PalavrasChavesFormData) => {
    setIsLoading(true);
    setResultado("");
    
    try {
      // Converter conteúdo de textarea para array
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      // Default fallback result if webhook fails
      let resultadoText = `# Análise de Palavras-Chave\n\nPalavras-chave analisadas:\n\n${palavrasFundoArray.map(word => `- ${word}`).join('\n')}`;
      
      try {
        // Try to get result from webhook
        const webhookResponse = await sendToWebhook(data);
        
        // Check if webhook returned a result
        if (webhookResponse && typeof webhookResponse === 'object') {
          // Handle different response formats
          if (webhookResponse.resultado) {
            resultadoText = webhookResponse.resultado;
          } else if (webhookResponse.output) {
            resultadoText = webhookResponse.output;
          } else if (webhookResponse.text) {
            resultadoText = webhookResponse.text;
          } else if (webhookResponse.result) {
            resultadoText = webhookResponse.result;
          } else if (typeof webhookResponse === 'string') {
            resultadoText = webhookResponse;
          }
          console.log('Resultado final do webhook:', resultadoText);
        } else {
          console.log('Webhook não retornou dados em um formato reconhecível');
        }
      } catch (webhookError) {
        console.error('Erro detalhado ao processar webhook:', webhookError);
        toast({
          variant: "destructive",
          title: "Erro ao processar dados",
          description: "Não foi possível obter resposta do webhook. Usando análise básica.",
        });
        // Continue using fallback result
      }
      
      setRequestData(JSON.stringify(data));
      setResultado(resultadoText);
      
      toast({
        title: "Sucesso!",
        description: "Análise concluída com sucesso.",
      });

      await refetchHistorico();
      methods.reset();
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    isLoading,
    resultado,
    requestData,
    onSubmit,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  };
};
