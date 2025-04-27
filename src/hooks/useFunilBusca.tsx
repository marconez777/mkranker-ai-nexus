
import { useFormManager } from "./funil-busca/useFormManager";
import { useHistoryManager } from "./funil-busca/useHistoryManager";
import { useWebhookHandler } from "./funil-busca/useWebhookHandler";

export const useFunilBusca = () => {
  const { methods } = useFormManager();
  const { 
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit: submitWebhook,
    handleRetry 
  } = useWebhookHandler();
  const {
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  } = useHistoryManager();

  const handleSubmit = methods.handleSubmit(submitWebhook);

  return {
    methods,
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit,
    handleRetry,
    handleDelete,
    handleRename,
    analises,
    refetchHistorico
  };
};
