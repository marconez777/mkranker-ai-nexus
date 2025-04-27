
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
        palavrasFundo: data.palavrasFundo,
        timestamp: new Date().toISOString()
      });
      
      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook-test/palavras-chave';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          palavrasFundo: data.palavrasFundo,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Obter a resposta do webhook
      const webhookResponse = await response.json();
      console.log('Resposta do webhook:', webhookResponse);
      
      // Retornar a resposta do webhook, que será usada como resultado
      return webhookResponse;
      
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      throw error; // Propagar o erro para ser tratado em onSubmit
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

      // Texto de resultado inicial (fallback caso o webhook falhe)
      let resultadoText = `# Análise de Palavras-Chave\n\nPalavras-chave analisadas:\n\n${palavrasFundoArray.map(word => `- ${word}`).join('\n')}`;
      
      try {
        // Enviar para webhook e obter resposta
        const webhookResponse = await sendToWebhook(data);
        
        // Se o webhook retornar um resultado, usar isso como resultado final
        if (webhookResponse && webhookResponse.resultado) {
          resultadoText = webhookResponse.resultado;
          console.log('Usando resultado do webhook:', resultadoText);
        } else {
          console.log('Webhook não retornou resultado, usando fallback');
        }
      } catch (webhookError) {
        console.error('Erro no webhook, usando resultado fallback:', webhookError);
        toast({
          variant: "destructive",
          title: "Erro ao processar dados",
          description: "Não foi possível processar os dados no webhook. Usando análise básica.",
        });
        // Continua usando o resultadoText de fallback
      }
      
      // Salvar no Supabase com o resultado final (do webhook ou fallback)
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
        description: "Suas palavras-chave foram processadas e salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar palavras-chave:", error);
      
      setErrorMessage("Não foi possível salvar suas palavras-chave. Tente novamente.");
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas palavras-chave. Tente novamente.",
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
