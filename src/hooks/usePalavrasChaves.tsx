
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PalavrasChavesFormData, palavrasChavesSchema } from "@/types/palavras-chaves";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const usePalavrasChaves = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const { data: analises, refetch: refetchAnalises } = useQuery({
    queryKey: ['palavras-chaves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('palavras_chaves')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const onSubmit = async (data: PalavrasChavesFormData) => {
    setIsLoading(true);
    
    try {
      // Convert textarea content to array
      const palavrasFundoArray = data.palavrasFundo
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);

      // Save to Supabase
      const { error: saveError } = await supabase
        .from('palavras_chaves')
        .insert({
          palavras_fundo: palavrasFundoArray,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (saveError) throw saveError;
      
      await refetchAnalises();
      methods.reset();
      
      toast({
        title: "Sucesso!",
        description: "Suas palavras-chave foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar palavras-chave:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas palavras-chave. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    isLoading,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises
  };
};
