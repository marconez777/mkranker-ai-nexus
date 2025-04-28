
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PalavrasChavesFormData } from "@/types/palavras-chaves";
import { supabase } from "@/integrations/supabase/client";

export const useWebhookHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [requestData, setRequestData] = useState("");
  const { toast } = useToast();

  const sendToWebhook = async (data: PalavrasChavesFormData) => {
    try {
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook-test/palavras-chave';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          palavrasFundo: palavrasFundoArray,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const webhookResponse = await response.json();
      console.log('Resposta completa do webhook:', webhookResponse);
      
      return webhookResponse;
      
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      throw error;
    }
  };

  const processWebhookResponse = (data: any) => {
    if (typeof data === 'object') {
      if (data.resultado) return data.resultado;
      if (data.output) return data.output;
      if (data.text) return data.text;
      if (data.result) return data.result;
      
      if (Array.isArray(data)) {
        return data.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join('\n');
      }
      
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }
    return String(data);
  };

  const handleSubmit = async (data: PalavrasChavesFormData) => {
    setIsLoading(true);
    setResultado("");
    
    try {
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      let resultadoText = `# Análise de Palavras-Chave\n\n${palavrasFundoArray.map(word => `- ${word}`).join('\n')}`;
      
      try {
        const webhookResponse = await sendToWebhook(data);
        resultadoText = processWebhookResponse(webhookResponse);
      } catch (webhookError) {
        console.error('Erro detalhado ao processar webhook:', webhookError);
        toast({
          variant: "destructive",
          title: "Erro ao processar dados",
          description: "Não foi possível obter resposta do webhook. Usando análise básica.",
        });
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error: saveError } = await supabase
            .from('palavras_chaves')
            .insert({
              palavras_fundo: palavrasFundoArray,
              resultado: resultadoText,
              user_id: user.id
            });

          if (saveError) {
            throw saveError;
          }
        }
      } catch (supabaseError) {
        console.error("Error with Supabase operation:", supabaseError);
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "A análise foi gerada mas não foi possível salvá-la no histórico.",
        });
      }

      setRequestData(JSON.stringify(data));
      setResultado(resultadoText);
      
      toast({
        title: "Sucesso!",
        description: "Análise concluída com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao processar requisição:', error);
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
    isLoading,
    resultado,
    requestData,
    onSubmit: handleSubmit
  };
};
