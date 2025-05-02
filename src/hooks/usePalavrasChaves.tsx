
import { useFormManager } from "./palavras-chaves/useFormManager";
import { useHistoryManager } from "./palavras-chaves/useHistoryManager";
import { useWebhookHandler } from "./palavras-chaves/useWebhookHandler";
import { useLimitChecker } from "./useLimitChecker";
import { useSubscriptionGate } from "./useSubscriptionGate";

export const usePalavrasChaves = () => {
  // Check if user has active subscription
  const hasActiveSubscription = useSubscriptionGate();
  
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
    // Return early if no active subscription
    if (!hasActiveSubscription) return;
    
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    await handleWebhookSubmit(data);
  });

  const handleRetry = () => {
    // Return early if no active subscription
    if (!hasActiveSubscription) return;
    
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
    refetchHistorico,
    remaining,
    hasActiveSubscription
  };
};
