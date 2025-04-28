
import { useFormManager } from "./palavras-chaves/useFormManager";
import { useWebhookHandler } from "./palavras-chaves/useWebhookHandler";
import { useHistoryManager } from "./palavras-chaves/useHistoryManager";

export const usePalavrasChavesWebhook = () => {
  const { methods } = useFormManager();
  const { isLoading, resultado, requestData, onSubmit } = useWebhookHandler();
  const { analises, refetchHistorico, handleDelete, handleRename } = useHistoryManager();

  return {
    methods,
    isLoading,
    resultado,
    requestData,
    onSubmit,
    handleSubmit: methods.handleSubmit(onSubmit),
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  };
};
