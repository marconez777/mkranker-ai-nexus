
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const metaDadosSchema = z.object({
  nomeSite: z.string().min(1, "O nome do site é obrigatório"),
  palavraChaveFoco: z.string().min(1, "A palavra-chave em foco é obrigatória"),
  palavraRelacionada: z.string().min(1, "A palavra-chave relacionada é obrigatória"),
  tipoPagina: z.string().min(1, "O tipo de página é obrigatório"),
});

type MetaDadosFormData = z.infer<typeof metaDadosSchema>;

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
      
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meta_dados')
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

  const handleRename = async (id: string, newNomeSite: string) => {
    try {
      const { error } = await supabase
        .from('meta_dados')
        .update({ nome_site: newNomeSite })
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

  const onSubmit = async (data: MetaDadosFormData) => {
    setIsLoading(true);
    try {
      const webhookBody = {
        nomeSite: data.nomeSite,
        palavraChaveFoco: data.palavraChaveFoco,
        palavraRelacionada: data.palavraRelacionada,
        tipoPagina: data.tipoPagina,
      };

      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/meta', {
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
      const textoResultado = responseData.resultado || responseData.text || responseData.output || JSON.stringify(responseData);
      
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
    analises,
    handleDelete,
    handleRename
  };
};
