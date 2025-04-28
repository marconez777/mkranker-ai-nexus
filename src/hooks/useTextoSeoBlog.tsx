
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const textoSeoBlogSchema = z.object({
  tema: z.string().min(1, "O tema é obrigatório"),
  palavraChave: z.string().min(1, "A palavra-chave em foco é obrigatória"),
  palavrasRelacionadas: z.string().min(1, "Insira pelo menos uma palavra-chave relacionada"),
  observacoes: z.string().optional(),
});

type TextoSeoBlogFormData = z.infer<typeof textoSeoBlogSchema>;

type TextoSeoBlog = {
  id: string;
  user_id: string;
  tema: string;
  palavra_chave: string;
  palavras_relacionadas: string[];
  observacoes: string | null;
  resultado: string;
  created_at: string;
  updated_at: string;
}

export const useTextoSeoBlog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const methods = useForm<TextoSeoBlogFormData>({
    resolver: zodResolver(textoSeoBlogSchema),
    defaultValues: {
      tema: "",
      palavraChave: "",
      palavrasRelacionadas: "",
      observacoes: "",
    }
  });

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['texto-seo-blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('texto_seo_blog')
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
      
      return (data || []) as TextoSeoBlog[];
    },
  });

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    const formData = methods.getValues();
    onSubmit(formData);
  };

  const onSubmit = async (data: TextoSeoBlogFormData) => {
    setIsLoading(true);
    try {
      const palavrasRelacionadas = data.palavrasRelacionadas
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      const webhookBody = {
        tema: data.tema,
        palavraChave: data.palavraChave,
        palavrasRelacionadas,
        observacoes: data.observacoes || ""
      };

      // URL correta do webhook
      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook/post';
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
          .from('texto_seo_blog')
          .insert({
            tema: data.tema,
            palavra_chave: data.palavraChave,
            palavras_relacionadas: palavrasRelacionadas,
            observacoes: data.observacoes,
            resultado: textoResultado,
            user_id: user.id
          });

        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "O texto foi gerado mas não foi possível salvá-lo no histórico.",
          });
        } else {
          await refetchAnalises();
        }
      }

      toast({
        title: "Sucesso!",
        description: "Texto gerado com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao processar texto:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível gerar o texto. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add the missing functions for handling delete, rename, and refetch
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('texto_seo_blog')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting analysis:", error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Não foi possível excluir a análise.",
        });
        return;
      }

      await refetchAnalises();
      
      toast({
        title: "Análise excluída",
        description: "A análise foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao tentar excluir a análise.",
      });
    }
  };

  const handleRename = async (id: string, newTema: string) => {
    try {
      const { error } = await supabase
        .from('texto_seo_blog')
        .update({ tema: newTema })
        .eq('id', id);

      if (error) {
        console.error("Error renaming analysis:", error);
        toast({
          variant: "destructive",
          title: "Erro ao renomear",
          description: "Não foi possível renomear a análise.",
        });
        return;
      }

      await refetchAnalises();
      
      toast({
        title: "Análise renomeada",
        description: "A análise foi renomeada com sucesso.",
      });
    } catch (error) {
      console.error("Error in handleRename:", error);
      toast({
        variant: "destructive",
        title: "Erro ao renomear",
        description: "Ocorreu um erro ao tentar renomear a análise.",
      });
    }
  };

  const refetchHistorico = async () => {
    try {
      await refetchAnalises();
      return true;
    } catch (error) {
      console.error("Error refetching history:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o histórico.",
      });
      return false;
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
    refetchHistorico
  };
};
