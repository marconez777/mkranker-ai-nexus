
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { palavrasChavesSchema, type PalavrasChavesFormData } from "@/types/palavras-chaves";

export const usePalavrasChavesWebhook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<string>("");
  const { toast } = useToast();

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const sendToWebhook = async (palavrasFundo: string[]) => {
    const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/palavras-chave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        palavrasFundo,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const onSubmit = async (data: PalavrasChavesFormData) => {
    try {
      setIsLoading(true);
      
      // Converter texto em array de palavras
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      // Enviar para webhook
      const webhookResponse = await sendToWebhook(palavrasFundoArray);
      
      // Definir resultado baseado na resposta
      if (webhookResponse) {
        const resultText = webhookResponse.resultado || 
                          webhookResponse.output || 
                          webhookResponse.text || 
                          webhookResponse.result || 
                          JSON.stringify(webhookResponse);
                          
        setResultado(resultText);
        
        toast({
          title: "Sucesso!",
          description: "Análise de palavras-chave concluída.",
        });
        
        methods.reset();
      }
    } catch (error) {
      console.error('Erro ao processar palavras-chave:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível obter resposta do webhook.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    isLoading,
    resultado,
    handleSubmit: methods.handleSubmit(onSubmit)
  };
};
