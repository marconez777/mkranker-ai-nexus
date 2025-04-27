
import { useToast } from "@/hooks/use-toast";
import { FunilBuscaFormData } from "@/types/funil-busca";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWebhookHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const sendToWebhook = async (data: FunilBuscaFormData) => {
    try {
      console.log("Enviando dados para o webhook:", data);
      
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/f403ed72-e710-4b5d-a2bb-5c57679857d3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(data)
      });
      
      console.log("Dados enviados para webhook com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao enviar dados para webhook:", error);
      return false;
    }
  };

  const handleSubmit = async (data: FunilBuscaFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setResultado("");
    
    try {
      console.log("Enviando dados para o webhook...");
      
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/f403ed72-e710-4b5d-a2bb-5c57679857d3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.log("Primeira tentativa falhou, tentando com no-cors...");
        await sendToWebhook(data);
        throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
      }

      console.log("Resposta recebida do webhook");
      const responseText = await response.text();
      console.log("Resposta bruta do webhook:", responseText);
      
      let resultText = "";
      try {
        const responseData = JSON.parse(responseText);
        console.log("Dados da resposta parseados:", responseData);
        
        if (typeof responseData === 'string') {
          resultText = responseData;
        } else if (responseData && responseData.message) {
          resultText = responseData.message;
        } else if (responseData && responseData.output) {
          resultText = responseData.output;
        } else {
          resultText = JSON.stringify(responseData);
        }
      } catch (parseError) {
        console.log("Resposta não é JSON válido, usando texto bruto");
        resultText = responseText;
      }
      
      console.log("Texto do resultado final:", resultText);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("Usuário não autenticado");
          toast({
            variant: "destructive",
            title: "Erro de autenticação",
            description: "Você precisa estar logado para salvar análises.",
          });
          
          setResultado(resultText);
          setErrorMessage("");
          setRetryCount(0);
          return;
        }
        
        const { error: saveError } = await supabase
          .from('analise_funil_busca')
          .insert({
            micro_nicho: data.microNicho,
            publico_alvo: data.publicoAlvo,
            segmento: data.segmento,
            resultado: resultText,
            user_id: user.id
          });

        if (saveError) {
          console.error("Erro ao salvar no Supabase:", saveError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "A análise foi gerada mas não foi possível salvá-la no histórico.",
          });
        } else {
          console.log("Análise salva com sucesso no banco de dados");
        }
      } catch (supabaseError) {
        console.error("Erro ao salvar no Supabase:", supabaseError);
      }
      
      setResultado(resultText);
      setErrorMessage("");
      setRetryCount(0);
      
      toast({
        title: "Sucesso!",
        description: "Sua análise foi processada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setResultado("");
      setErrorMessage("Não foi possível conectar ao servidor do webhook. O servidor pode estar indisponível ou existe um problema de conexão. Tente novamente mais tarde.");
      
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Ocorreu um erro ao enviar os dados. O servidor pode estar indisponível.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setErrorMessage("");
  };

  return {
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit,
    handleRetry,
  };
};
