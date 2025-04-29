
import { useFormManager } from "./palavras-chaves/useFormManager";
import { useHistoryManager } from "./palavras-chaves/useHistoryManager";
import { useWebhookHandler } from "./palavras-chaves/useWebhookHandler";
import { useLimitChecker } from "./useLimitChecker";

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
    handleDelete,
    handleRename,
    refetchHistorico,
  } = useHistoryManager();

  const { checkAndIncrementUsage, remaining } = useLimitChecker("palavrasChaves");

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
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    await handleWebhookSubmit(data);
  });

  const handleRetry = () => {
    webhookHandleRetry(methods.getValues);
  };

  return {
    methods,
    isLoading,
    resultado,
    handleSubmit,
    analises,
    retryCount,
    handleRetry,
    handleDelete,
    handleRename,
    refetchHistorico,
    remaining
  };
};
