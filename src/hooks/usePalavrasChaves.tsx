
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

  const sendToWebhook = async (data: PalavrasChavesFormData, resultadoText: string) => {
    try {
      console.log('Sending to webhook with data:', {
        palavrasFundo: data.palavrasFundo,
        resultado: resultadoText,
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
          resultado: resultadoText,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const webhookResponse = await response.json();
      console.log('Webhook response:', webhookResponse);
      
      // Update the resultado with the webhook response if it exists
      if (webhookResponse && webhookResponse.resultado) {
        return webhookResponse.resultado;
      }
      
      return resultadoText; // Return original text if no webhook response
    } catch (error) {
      console.error('Error sending to webhook:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar dados",
        description: "Não foi possível enviar os dados para o webhook.",
      });
      return resultadoText; // Return original text if webhook fails
    }
  };

  const onSubmit = async (data: PalavrasChavesFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Convert textarea content to array
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      // Generate initial result text
      let resultadoText = `# Análise de Palavras-Chave\n\nPalavras-chave analisadas:\n\n${palavrasFundoArray.map(word => `- ${word}`).join('\n')}`;
      
      // Send to webhook and get response
      const webhookResult = await sendToWebhook(data, resultadoText);
      resultadoText = webhookResult; // Update with webhook response if available
      
      // Save to Supabase with the final result
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
        description: "Suas palavras-chave foram salvas e enviadas com sucesso.",
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
