
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useLimitChecker } from "./useLimitChecker";

const pautasBlogSchema = z.object({
  palavraChave: z.string().min(1, "A palavra-chave é obrigatória"),
});

type PautasBlogFormData = z.infer<typeof pautasBlogSchema>;

type PautaBlog = {
  id: string;
  user_id: string;
  palavra_chave: string;
  resultado: string;
  created_at: string;
  updated_at: string;
}

export const usePautasBlog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { checkAndIncrementUsage, remaining } = useLimitChecker("pautasBlog");

  const methods = useForm<PautasBlogFormData>({
    resolver: zodResolver(pautasBlogSchema),
    defaultValues: {
      palavraChave: "",
    }
  });

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['pautas-blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pautas_blog')
        .select('*')
        .order('created_at', { ascending: false }) as { data: PautaBlog[] | null, error: any };
      
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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    const formData = methods.getValues();
    onSubmit(formData);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pautas_blog')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refetchAnalises();
      
      toast({
        title: "Sucesso!",
        description: "Análise excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a análise. Tente novamente.",
      });
    }
  };

  const handleRename = async (id: string, newPalavraChave: string) => {
    try {
      const { error } = await supabase
        .from('pautas_blog')
        .update({ palavra_chave: newPalavraChave })
        .eq('id', id);

      if (error) throw error;

      await refetchAnalises();
      
      toast({
        title: "Sucesso!",
        description: "Análise renomeada com sucesso.",
      });
    } catch (error) {
      console.error("Error renaming analysis:", error);
      toast({
        variant: "destructive",
        title: "Erro ao renomear",
        description: "Não foi possível renomear a análise. Tente novamente.",
      });
    }
  };

  const onSubmit = async (data: PautasBlogFormData) => {
    // Check limits before proceeding
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    setIsLoading(true);
    try {
      const webhookBody = {
        palavraChave: data.palavraChave,
      };

      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook/pautas';
      console.log(`Enviando requisição para: ${webhookUrl}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na resposta (${response.status}):`, errorText);
        throw new Error(`Erro ao processar a solicitação: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Webhook response:", responseData);
      
      const textoResultado = responseData.texto || responseData.output || responseData.result || JSON.stringify(responseData);
      console.log("Texto resultado formatado:", textoResultado);
      
      setResultado(textoResultado);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: saveError } = await supabase
          .from('pautas_blog')
          .insert({
            palavra_chave: data.palavraChave,
            resultado: textoResultado,
            user_id: user.id
          });

        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "As sugestões foram geradas mas não foi possível salvá-las no histórico.",
          });
        } else {
          await refetchAnalises();
        }
      }

      toast({
        title: "Sucesso!",
        description: "Sugestões de pautas geradas com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao processar sugestões:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível gerar as sugestões. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    isLoading,
    resultado,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises,
    retryCount,
    handleRetry,
    handleDelete,
    handleRename,
    remaining
  };
};
