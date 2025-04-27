import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { palavrasChavesSchema, type PalavrasChavesFormData } from "@/types/palavras-chaves";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const usePalavrasChavesWebhook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<string>("");
  const [requestData, setRequestData] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['palavras-chaves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('palavras_chaves')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching history:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar histórico",
          description: "Não foi possível carregar o histórico de análises.",
        });
        return [];
      }
      
      return data || [];
    },
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
    setIsLoading(true);
    setErrorMessage("");
    setResultado("");
    
    try {
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
      
      // Save to Supabase after successful webhook response
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error: saveError } = await supabase
            .from('palavras_chaves')
            .insert({
              palavras_fundo: data.palavrasFundo.split('\n').map(word => word.trim()).filter(Boolean),
              resultado: formattedResult,
              user_id: user.id
            });

          if (saveError) {
            console.error("Error saving to Supabase:", saveError);
            toast({
              variant: "destructive",
              title: "Erro ao salvar",
              description: "A análise foi gerada mas não foi possível salvá-la no histórico.",
            });
          } else {
            await refetchAnalises();
          }
        }
      } catch (supabaseError) {
        console.error("Error with Supabase operation:", supabaseError);
      }

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

  const processOutputFormat = (output: string): string => {
    if (output.includes('**') && output.includes('\n\n')) {
      return output;
    }
    
    const sections = output.split(/\*\*([^*]+)\*\*/g);
    let formattedOutput = '';
    
    if (sections.length > 1) {
      let currentTitle = '';
      let isTitle = false;
      
      sections.forEach((section, index) => {
        const trimmedSection = section.trim();
        
        if (index % 2 === 1) {
          currentTitle = trimmedSection;
          formattedOutput += `\n\n## **${currentTitle}**\n\n`;
          isTitle = true;
        } else if (trimmedSection && isTitle) {
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
    
    return output.split('\n').join('\n\n');
  };

  return {
    methods,
    isLoading,
    resultado,
    requestData,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises
  };
};
