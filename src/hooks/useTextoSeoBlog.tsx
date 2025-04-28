
import { useFormManager } from "./texto-seo-blog/useFormManager";
import { useHistoryManager } from "./texto-seo-blog/useHistoryManager";
import { useWebhookHandler } from "./texto-seo-blog/useWebhookHandler";

export const useTextoSeoBlog = () => {
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

  const handleRetry = () => {
    webhookHandleRetry(methods.getValues);
  };

  return {
    methods,
    isLoading,
    resultado,
    handleSubmit: methods.handleSubmit(handleWebhookSubmit),
    analises,
    retryCount,
    handleRetry,
    handleDelete,
    handleRename,
    refetchHistorico,
  };
};
