
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunilBuscaFormData, funilBuscaSchema } from "@/types/funil-busca";

export const useFormManager = () => {
  const methods = useForm<FunilBuscaFormData>({
    resolver: zodResolver(funilBuscaSchema),
    defaultValues: {
      microNicho: "",
      publicoAlvo: "",
      segmento: ""
    }
  });

  return {
    methods,
  };
};
