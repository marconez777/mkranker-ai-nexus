
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PalavrasChavesFormData, palavrasChavesSchema, PalavrasChavesAnalise } from "@/types/palavras-chaves";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const usePalavrasChaves = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const { data: analises, refetch: refetchAnalises } = useQuery({
    queryKey: ['palavras-chaves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('palavras_chaves')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PalavrasChavesAnalise[];
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
    setErrorMessage("");
    
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
      
      // Save to Supabase
      const { error: saveError } = await supabase
        .from('palavras_chaves')
        .insert({
          palavras_fundo: palavrasFundoArray,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          resultado: resultadoText
        });

      if (saveError) throw saveError;
      
      setResultado(resultadoText);
      await refetchAnalises();
      methods.reset();
      
      toast({
        title: "Sucesso!",
        description: "Análise de palavras-chave concluída com sucesso.",
      });
    } catch (error) {
      console.error("Erro completo ao processar palavras-chave:", error);
      
      setErrorMessage("Não foi possível processar suas palavras-chave. Tente novamente.");
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível processar suas palavras-chave. Tente novamente.",
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
