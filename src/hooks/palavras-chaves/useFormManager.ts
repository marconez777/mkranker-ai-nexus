
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const palavrasChavesSchema = z.object({
  palavrasChave: z.string().min(1, "Digite pelo menos uma palavra-chave"),
});

export type PalavrasChavesFormData = z.infer<typeof palavrasChavesSchema>;

export const useFormManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasChave: "",
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
