import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { palavrasChavesSchema, type PalavrasChavesFormData } from "@/types/palavras-chaves";

export const usePalavrasChavesWebhook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<string>("");
  const [requestData, setRequestData] = useState<string>("");
  const { toast } = useToast();

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const sendToWebhook = async (palavras: string) => {
    // Formatar as palavras para envio - remover linhas vazias e duplicadas
    const linhas = palavras
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0);
    
    // Remover duplicatas
    const linhasUnicas = [...new Set(linhas)];
    
    // Juntar novamente em um texto
    const textoFormatado = linhasUnicas.join('\n');
    
    console.log("===== DADOS A SEREM ENVIADOS =====");
    console.log(textoFormatado);
    console.log("==================================");
    
    // Preparar o corpo da requisição
    const bodyData = { palavras: textoFormatado };
    setRequestData(JSON.stringify(bodyData, null, 2));
    
    // Enviar para o webhook
    console.log("Enviando requisição para webhook:", bodyData);
    
    const response = await fetch('https://mkseo77.app.n8n.cloud/webhook-test/palavras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta do webhook:", response.status, errorText);
      throw new Error(`Erro HTTP: ${response.status} - ${errorText || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Resposta bruta do webhook:", responseData);
    return responseData;
  };

  const onSubmit = async (data: PalavrasChavesFormData) => {
    try {
      setIsLoading(true);
      setResultado("");
      setRequestData("");
      
      // Enviar a string de palavras-chave
      const palavras = data.palavrasFundo.trim();
      
      if (!palavras) {
        toast({
          variant: "destructive",
          title: "Erro no formulário",
          description: "Por favor, insira pelo menos uma palavra-chave.",
        });
        return;
      }

      console.log("Preparando para enviar palavras-chave:");
      console.log(palavras);
      
      // Enviar para webhook
      const webhookResponse = await sendToWebhook(palavras);
      console.log("Resposta processada do webhook:", webhookResponse);
      
      // Definir resultado baseado na resposta
      if (webhookResponse) {
        // Tentar extrair o resultado de várias possíveis chaves
        const resultText = webhookResponse.resultado || 
                          webhookResponse.output || 
                          webhookResponse.text || 
                          webhookResponse.result || 
                          JSON.stringify(webhookResponse);
        
        console.log("Texto do resultado extraído:", resultText);
        setResultado(resultText);
        
        toast({
          title: "Sucesso!",
          description: "Análise de palavras-chave concluída.",
        });
      }
    } catch (error) {
      console.error('Erro detalhado ao processar palavras-chave:', error);
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
    methods,
    isLoading,
    resultado,
    requestData,
    handleSubmit: methods.handleSubmit(onSubmit)
  };
};
