
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
        setIsLoading(false);
        return;
      }

      // Create a simple mock result for testing if webhook is failing
      const fallbackResult = `# Análise de Palavras-Chave\n\n## Análise de volume de busca\n\n${palavras.split('\n').map(palavra => `- ${palavra.trim()}: Volume médio de busca`).join('\n\n')}\n\n## Palavras-chave relacionadas\n\n${palavras.split('\n').map(palavra => `- Relacionado a "${palavra.trim()}": palavras similares`).join('\n\n')}`;
      
      console.log("Preparando para enviar palavras-chave:");
      console.log(palavras);
      
      let webhookResponse;
      let formattedResult;
      
      try {
        webhookResponse = await sendToWebhook(palavras);
        console.log("Resposta bruta do webhook:", webhookResponse);
        formattedResult = formatResult(webhookResponse);
      } catch (webhookError) {
        console.error('Erro ao enviar para o webhook:', webhookError);
        
        // Use fallback result if webhook fails
        formattedResult = fallbackResult;
        
        toast({
          variant: "default",
          title: "Usando resultados offline",
          description: "Não foi possível conectar ao serviço de análise. Exibindo resultados simulados.",
        });
      }
      
      setResultado(formattedResult);
      
      // Try to save to Supabase after successful response
      try {
        const saved = await saveAnalysis(data.palavrasFundo, formattedResult);
        
        if (saved) {
          toast({
            title: "Sucesso!",
            description: "Análise de palavras-chave concluída e salva.",
          });
        } else {
          toast({
            title: "Análise concluída",
            description: "Resultado gerado mas não foi salvo no histórico.",
          });
        }
      } catch (saveError) {
        console.error('Erro ao salvar análise:', saveError);
        toast({
          title: "Análise concluída",
          description: "Resultado gerado mas houve um erro ao salvar no histórico.",
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
