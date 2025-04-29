
import { useFormManager } from "./palavras-chaves/useFormManager";
import { useHistoryManager } from "./palavras-chaves/useHistoryManager";
import { useWebhookHandler } from "./palavras-chaves/useWebhookHandler";

export const usePalavrasChaves = () => {
  const {
    methods,
    isLoading,
    setIsLoading,
    resultado,
    setResultado,
    retryCount,
    setRetryCount,
  } = useFormManager();

  const {
    analises,
    isLoading: isHistoryLoading,
    handleDelete,
    handleRename,
    refetchHistorico,
  } = useHistoryManager();

  const {
    handleWebhookSubmit,
    handleRetry: webhookHandleRetry,
  } = useWebhookHandler(
    setIsLoading,
    setResultado,
    setRetryCount,
    refetchHistorico
  );

  const handleSubmit = methods.handleSubmit(async (data) => {
    await handleWebhookSubmit(data);
  });

  const handleRetry = () => {
    webhookHandleRetry(methods.getValues);
  };

  return {
    methods,
    isLoading,
    isHistoryLoading,
    resultado,
    handleSubmit,
    analises,
    retryCount,
    handleRetry,
    handleDelete,
    handleRename,
    refetchHistorico
  };
};
