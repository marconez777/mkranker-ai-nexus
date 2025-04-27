
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
    const linhas = palavras
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0);
    
    const linhasUnicas = [...new Set(linhas)];
    
    const textoFormatado = linhasUnicas.join('\n');
    
    console.log("===== DADOS A SEREM ENVIADOS =====");
    console.log(textoFormatado);
    console.log("==================================");
    
    const bodyData = { palavras: textoFormatado };
    setRequestData(JSON.stringify(bodyData, null, 2));
    
    console.log("Enviando requisição para webhook:", bodyData);
    
    const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/palavras', {
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
      
      const webhookResponse = await sendToWebhook(palavras);
      console.log("Resposta processada do webhook:", webhookResponse);
      
      // Format response based on its structure
      let formattedResult = '';
      
      if (webhookResponse.resultado) {
        formattedResult = webhookResponse.resultado;
      } else if (webhookResponse.output) {
        formattedResult = webhookResponse.output;
      } else if (webhookResponse.text) {
        formattedResult = webhookResponse.text;
      } else if (typeof webhookResponse === 'object') {
        // Convert complex objects to a nice markdown format
        formattedResult = '# Análise de Palavras-Chave\n\n';
        
        // Handle arrays of data
        if (Array.isArray(webhookResponse)) {
          formattedResult += webhookResponse.map(item => {
            if (typeof item === 'object') {
              return Object.entries(item)
                .map(([key, value]) => `## ${key}\n${value}`)
                .join('\n\n');
            }
            return `- ${item}`;
          }).join('\n');
        } else {
          // Handle regular objects
          formattedResult += Object.entries(webhookResponse)
            .map(([key, value]) => `## ${key}\n${value}`)
            .join('\n\n');
        }
      } else {
        formattedResult = webhookResponse.toString();
      }
      
      setResultado(formattedResult);
      
      toast({
        title: "Sucesso!",
        description: "Análise de palavras-chave concluída.",
      });
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

