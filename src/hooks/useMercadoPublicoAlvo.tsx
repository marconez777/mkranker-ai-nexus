import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MercadoPublicoAlvoFormData, mercadoPublicoAlvoSchema } from "@/types/mercado-publico-alvo";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useLimitChecker } from "./useLimitChecker";

export const useMercadoPublicoAlvo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { checkAndIncrementUsage, remaining } = useLimitChecker("mercadoPublicoAlvo");

  const methods = useForm<MercadoPublicoAlvoFormData>({
    resolver: zodResolver(mercadoPublicoAlvoSchema),
    defaultValues: {
      nicho: "",
      servicoFoco: "",
      segmentos: "",
      problema: ""
    }
  });

  const { data: analises, refetch: refetchAnalises } = useQuery({
    queryKey: ['analises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analise_mercado')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const sendToWebhook = async (data: MercadoPublicoAlvoFormData) => {
    try {
      console.log("Enviando dados para o webhook:", data);
      
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/pesquisa-mercado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(data)
      });
      
      console.log("Dados enviados para o webhook com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao enviar dados para webhook:", error);
      return false;
    }
  };

  const onSubmit = async (data: MercadoPublicoAlvoFormData) => {
    // Check limits before proceeding
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    setResultado(""); // Clear previous results
    
    try {
      console.log("Processando dados do formulário:", data);
      
      // First attempt direct fetch with json response handling
      try {
        console.log("Enviando requisição para o webhook...");
        const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/pesquisa-mercado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        console.log("Status da resposta:", response.status);
        
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
        }

        // Try to parse response
        const responseText = await response.text();
        console.log("Resposta bruta:", responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log("Dados da resposta parseados:", responseData);
        } catch (parseError) {
          console.log("Resposta não é JSON válido, usando texto bruto");
          responseData = { output: responseText };
        }

        const resultado = responseData.output || responseData.message || responseText;
        console.log("Resultado final:", resultado);
        
        // Attempt to save to Supabase
        try {
          const { error: saveError } = await supabase
            .from('analise_mercado')
            .insert({
              nicho: data.nicho,
              servico_foco: data.servicoFoco,
              segmentos: data.segmentos,
              problema: data.problema,
              resultado: JSON.stringify({ output: resultado }),
              user_id: (await supabase.auth.getUser()).data.user?.id
            });

          if (saveError) {
            console.error("Erro ao salvar no Supabase:", saveError);
            throw saveError;
          }
          
          setResultado(resultado);
          setErrorMessage("");
          setRetryCount(0);
          await refetchAnalises();
          
          toast({
            title: "Sucesso!",
            description: "Sua análise foi enviada e salva com sucesso.",
          });
        } catch (supabaseError) {
          console.error("Erro ao salvar no Supabase:", supabaseError);
          // Still show the result even if saving to Supabase fails
          setResultado(resultado);
          
          toast({
            variant: "destructive", 
            title: "Erro ao salvar",
            description: "Análise gerada com sucesso, mas não foi possível salvar no histórico.",
          });
        }
      } catch (fetchError) {
        console.error("Erro na requisição fetch:", fetchError);
        
        // Fallback to no-cors mode if direct fetch fails
        const webhookSent = await sendToWebhook(data);
        
        if (webhookSent) {
          toast({
            title: "Requisição enviada",
            description: "Sua análise foi enviada, mas não foi possível receber a resposta automaticamente.",
          });
        } else {
          throw new Error("Não foi possível conectar ao servidor do webhook.");
        }
      }
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
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
    analises,
    remaining
  };
};
