
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TextoSeoBlogFormData } from "./useFormManager";

export const useWebhookHandler = (
  setIsLoading: (loading: boolean) => void,
  setResultado: (result: string) => void,
  setRetryCount: (count: number) => void,
  refetchAnalises: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleWebhookSubmit = async (data: TextoSeoBlogFormData) => {
    setIsLoading(true);
    try {
      const palavrasRelacionadas = data.palavrasRelacionadas
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      const webhookBody = {
        tema: data.tema,
        palavraChave: data.palavraChave,
        palavrasRelacionadas,
        observacoes: data.observacoes || ""
      };

      // URL correta do webhook
      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook/post';
      console.log(`Enviando requisição para: ${webhookUrl}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na resposta (${response.status}):`, errorText);
        throw new Error(`Erro ao processar a solicitação: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Webhook response:", responseData);
      
      const textoResultado = responseData.texto || responseData.output || responseData.result || JSON.stringify(responseData);
      console.log("Texto resultado formatado:", textoResultado);
      
      setResultado(textoResultado);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: saveError } = await supabase
          .from('texto_seo_blog')
          .insert({
            tema: data.tema,
            palavra_chave: data.palavraChave,
            palavras_relacionadas: palavrasRelacionadas,
            observacoes: data.observacoes,
            resultado: textoResultado,
            user_id: user.id
          });

        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "O texto foi gerado mas não foi possível salvá-lo no histórico.",
          });
        } else {
          await refetchAnalises();
        }
      }

      toast({
        title: "Sucesso!",
        description: "Texto gerado com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao processar texto:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível gerar o texto. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (getValues: () => TextoSeoBlogFormData) => {
    setRetryCount(prev => prev + 1);
    const formData = getValues();
    handleWebhookSubmit(formData);
  };

  return {
    handleWebhookSubmit,
    handleRetry,
  };
};
