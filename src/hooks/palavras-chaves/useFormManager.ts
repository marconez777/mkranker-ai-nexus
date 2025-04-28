
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PalavrasChavesFormData, palavrasChavesSchema } from "@/types/palavras-chaves";

export const useFormManager = () => {
  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  return { methods };
};
