
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const textoSeoBlogSchema = z.object({
  tema: z.string().min(1, "O tema é obrigatório"),
  palavraChave: z.string().min(1, "A palavra-chave em foco é obrigatória"),
  palavrasRelacionadas: z.string().min(1, "Insira pelo menos uma palavra-chave relacionada"),
  observacoes: z.string().optional(),
});

export type TextoSeoBlogFormData = z.infer<typeof textoSeoBlogSchema>;

export const useFormManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const methods = useForm<TextoSeoBlogFormData>({
    resolver: zodResolver(textoSeoBlogSchema),
    defaultValues: {
      tema: "",
      palavraChave: "",
      palavrasRelacionadas: "",
      observacoes: "",
    }
  });

  const resetForm = () => {
    methods.reset();
    setResultado("");
  };

  return {
    methods,
    isLoading,
    setIsLoading,
    resultado,
    setResultado,
    retryCount,
    setRetryCount,
    resetForm,
  };
};
