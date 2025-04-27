
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const textoSeoProdutoSchema = z.object({
  nomeProduto: z.string().min(1, "O nome do produto é obrigatório"),
  palavraChave: z.string().min(1, "A palavra-chave em foco é obrigatória"),
  palavrasRelacionadas: z.string().min(1, "Insira pelo menos uma palavra-chave relacionada"),
  observacoes: z.string().optional(),
});

type TextoSeoProdutoFormData = z.infer<typeof textoSeoProdutoSchema>;

export const useTextoSeoProduto = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const { toast } = useToast();

  const methods = useForm<TextoSeoProdutoFormData>({
    resolver: zodResolver(textoSeoProdutoSchema),
    defaultValues: {
      nomeProduto: "",
      palavraChave: "",
      palavrasRelacionadas: "",
      observacoes: "",
    }
  });

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['texto-seo-produto'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('texto_seo_produto')
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

  const onSubmit = async (data: TextoSeoProdutoFormData) => {
    setIsLoading(true);
    try {
      const palavrasRelacionadas = data.palavrasRelacionadas
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      const webhookBody = {
        nomeProduto: data.nomeProduto,
        palavraChave: data.palavraChave,
        palavrasRelacionadas,
        observacoes: data.observacoes || ""
      };

      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook-test/texto-produto', {
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
      console.log("Formatted result:", textoResultado);
      
      setResultado(textoResultado);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: saveError } = await supabase
          .from('texto_seo_produto')
          .insert({
            nome_produto: data.nomeProduto,
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
