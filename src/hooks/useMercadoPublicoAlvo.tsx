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

  const onSubmit = async (data: MercadoPublicoAlvoFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Enviando dados para o webhook...");
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
      
      const { error: saveError } = await supabase
        .from('analise_mercado')
        .insert({
          ...data,
          resultado,
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
