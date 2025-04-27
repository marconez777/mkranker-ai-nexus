
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
      
      let formattedResult = '';
      
      if (webhookResponse.resultado) {
        formattedResult = webhookResponse.resultado;
      } else if (webhookResponse.output) {
        // Processar o formato de saída, assumindo que é o formato mais comum
        formattedResult = processOutputFormat(webhookResponse.output);
      } else if (webhookResponse.text) {
        formattedResult = webhookResponse.text;
      } else if (typeof webhookResponse === 'object') {
        formattedResult = '# Análise de Palavras-Chave\n\n';
        
        if (Array.isArray(webhookResponse)) {
          formattedResult += webhookResponse.map(item => {
            if (typeof item === 'object') {
              return Object.entries(item)
                .map(([key, value]) => {
                  const formattedKey = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  return `\n## **${formattedKey}**\n\n${value}\n`;
                })
                .join('\n\n');
            }
            return `\n- **${item}**\n`;
          }).join('\n\n');
        } else {
          formattedResult += Object.entries(webhookResponse)
            .map(([key, value]) => {
              const formattedKey = key
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return `\n## **${formattedKey}**\n\n${value}\n`;
            })
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

  // Função para processar o formato de saída do webhook
  const processOutputFormat = (output: string): string => {
    // Verificar se já está em um formato legível
    if (output.includes('**') && output.includes('\n\n')) {
      return output; // Já está formatado
    }
    
    // Tentar extrair seções do texto
    const sections = output.split(/\*\*([^*]+)\*\*/g);
    let formattedOutput = '';
    
    // Se temos seções bem definidas, formatar cada uma
    if (sections.length > 1) {
      let currentTitle = '';
      let isTitle = false;
      
      sections.forEach((section, index) => {
        const trimmedSection = section.trim();
        
        if (index % 2 === 1) { // É um título
          currentTitle = trimmedSection;
          formattedOutput += `\n\n## **${currentTitle}**\n\n`;
          isTitle = true;
        } else if (trimmedSection && isTitle) {
          // Adicionar espaçamento extra entre o título e os itens
          // E entre os grupos de itens
          const items = trimmedSection.split('\n')
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => {
              if (item.startsWith('1.') || item.startsWith('-') || item.startsWith('*')) {
                return item;
              }
              return `- ${item}`;
            });
          
          formattedOutput += items.join('\n\n') + '\n\n';
          isTitle = false;
        }
      });
      
      return formattedOutput.trim();
    }
    
    // Se não conseguir identificar seções, apenas adicionar quebras de linha extras
    return output.split('\n').join('\n\n');
  };

  return {
    methods,
    isLoading,
    resultado,
    requestData,
    handleSubmit: methods.handleSubmit(onSubmit)
  };
};
