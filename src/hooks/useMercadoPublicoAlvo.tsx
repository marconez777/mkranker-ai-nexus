
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MercadoPublicoAlvoFormData, mercadoPublicoAlvoSchema } from "@/types/mercado-publico-alvo";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useMercadoPublicoAlvo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

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
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Processando dados do formulário");
      // Attempt to send data to webhook
      await sendToWebhook(data);
      
      try {
        const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/pesquisa-mercado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        const resultado = responseData.message || JSON.stringify(responseData);
        
        // Fixed the field name matching issue between form data and database schema
        const { error: saveError } = await supabase
          .from('analise_mercado')
          .insert({
            nicho: data.nicho,
            servico_foco: data.servicoFoco, // Map servicoFoco to servico_foco
            segmentos: data.segmentos,
            problema: data.problema,
            resultado: resultado,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (saveError) throw saveError;
        
        setResultado(resultado);
        setErrorMessage("");
        setRetryCount(0);
        await refetchAnalises();
        
        toast({
          title: "Sucesso!",
          description: "Sua análise foi enviada e salva com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao processar resposta:", error);
        setResultado("");
        setErrorMessage("Não foi possível conectar ao servidor do webhook. O servidor pode estar indisponível ou existe um problema de conexão. Tente novamente mais tarde.");
        
        toast({
          variant: "destructive",
          title: "Erro na conexão",
          description: "Ocorreu um erro ao enviar os dados. O servidor pode estar indisponível.",
        });
      }
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
    analises
  };
};
