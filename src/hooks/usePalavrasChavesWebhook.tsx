
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { palavrasChavesSchema, PalavrasChavesFormData } from "@/types/palavras-chaves";
import { useWebhookHandler } from "./palavras-chaves/useWebhookHandler";
import { useHistoryManager } from "./palavras-chaves/useHistoryManager";

export const usePalavrasChavesWebhook = () => {
  const methods = useForm<PalavrasChavesFormData>({
    resolver: zodResolver(palavrasChavesSchema),
    defaultValues: {
      palavrasFundo: "",
    }
  });

  const { isLoading, resultado, requestData, errorMessage, onSubmit } = useWebhookHandler();
  const { analises, refetchHistorico: refetchAnalises, handleDelete, handleRename } = useHistoryManager();

  return {
    methods,
    isLoading,
    resultado,
    requestData,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises,
    refetchHistorico: refetchAnalises,
    handleDelete,
    handleRename,
    errorMessage
  };
};
