
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const metaDadosSchema = z.object({
  nomeSite: z.string().min(1, "O nome é obrigatório"),
  palavraChaveFoco: z.string().min(1, "A palavra-chave em foco é obrigatória"),
  palavraRelacionada: z.string().min(1, "A palavra relacionada é obrigatória"),
  tipoPagina: z.string().min(1, "O tipo de página é obrigatório"),
});

type MetaDadosFormData = z.infer<typeof metaDadosSchema>;

type MetaDados = {
  id: string;
  user_id: string;
  nome_site: string;
  palavra_chave_foco: string;
  palavra_relacionada: string;
  tipo_pagina: string;
  resultado: string | null;
  created_at: string;
}

export const useMetaDados = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const { toast } = useToast();

  const methods = useForm<MetaDadosFormData>({
    resolver: zodResolver(metaDadosSchema),
    defaultValues: {
      nomeSite: "",
      palavraChaveFoco: "",
      palavraRelacionada: "",
      tipoPagina: "",
    }
  });

  const { data: analises = [], refetch: refetchAnalises } = useQuery({
    queryKey: ['meta-dados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meta_dados')
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
      
      return (data || []) as MetaDados[];
    },
  });

  const onSubmit = async (data: MetaDadosFormData) => {
    setIsLoading(true);
    try {
      const webhookBody = {
        nomeSite: data.nomeSite,
        palavraChaveFoco: data.palavraChaveFoco,
        palavraRelacionada: data.palavraRelacionada,
        tipoPagina: data.tipoPagina,
      };

      const webhookUrl = 'https://mkseo77.app.n8n.cloud/webhook-test/meta';
      console.log(`Enviando requisição para: ${webhookUrl}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody)
      });

      if (!response.ok) {
        throw new Error(`Erro ao processar a solicitação: ${response.status}`);
      }

      const responseData = await response.json();
      const textoResultado = responseData.texto || responseData.output || responseData.result || JSON.stringify(responseData);
      
      setResultado(textoResultado);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: saveError } = await supabase
          .from('meta_dados')
          .insert({
            nome_site: data.nomeSite,
            palavra_chave_foco: data.palavraChaveFoco,
            palavra_relacionada: data.palavraRelacionada,
            tipo_pagina: data.tipoPagina,
            resultado: textoResultado,
            user_id: user.id
          });

        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "Os meta dados foram gerados mas não foi possível salvá-los no histórico.",
          });
        } else {
          await refetchAnalises();
        }
      }

      toast({
        title: "Sucesso!",
        description: "Meta dados gerados com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao processar meta dados:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: "Não foi possível gerar os meta dados. Tente novamente.",
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

