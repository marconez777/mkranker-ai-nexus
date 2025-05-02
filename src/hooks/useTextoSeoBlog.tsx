
import { useFormManager } from "./texto-seo-blog/useFormManager";
import { useHistoryManager } from "./texto-seo-blog/useHistoryManager";
import { useWebhookHandler } from "./texto-seo-blog/useWebhookHandler";
import { useLimitChecker } from "./useLimitChecker";
import { useSubscriptionGate } from "./useSubscriptionGate";

export const useTextoSeoBlog = () => {
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
    handleDelete,
    handleRename,
    refetchHistorico,
  } = useHistoryManager();

  const { checkAndIncrementUsage, remaining } = useLimitChecker("textoSeoBlog");

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
