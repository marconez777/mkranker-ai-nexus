
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

      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook-test/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody)
      });

      if (!response.ok) {
        throw new Error('Erro ao processar a solicitação');
      }

      const responseData = await response.json();
      console.log("Webhook response:", responseData);
      
      const textoResultado = responseData.resultado || responseData.text || responseData.output || JSON.stringify(responseData);
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

  return {
    methods,
    isLoading,
    resultado,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises
  };
};
