
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

  const sendToWebhook = async (palavras: string) => {
    // Enviar as palavras como uma string simples para o webhook
    console.log("Enviando para o webhook:", palavras);
    
    const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/palavras-chave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ palavras })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const onSubmit = async (data: PalavrasChavesFormData) => {
    try {
      setIsLoading(true);
      setResultado("");
      
      // Enviar diretamente a string de palavras-chave
      const palavras = data.palavrasFundo.trim();
      
      if (!palavras) {
        toast({
          variant: "destructive",
          title: "Erro no formulário",
          description: "Por favor, insira pelo menos uma palavra-chave.",
        });
        return;
      }

      console.log("Enviando palavras-chave:", palavras);
      
      // Enviar para webhook
      const webhookResponse = await sendToWebhook(palavras);
      console.log("Resposta do webhook:", webhookResponse);
      
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
