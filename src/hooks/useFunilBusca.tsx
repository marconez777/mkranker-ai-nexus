
import { useFormManager } from "./funil-busca/useFormManager";
import { useHistoryManager } from "./funil-busca/useHistoryManager";
import { useWebhookHandler } from "./funil-busca/useWebhookHandler";
import { useLimitChecker } from "./useLimitChecker";
import { useToast } from "./use-toast";
import { useSubscriptionGate } from "./useSubscriptionGate";

export const useFunilBusca = () => {
  // Check if user has active subscription
  const hasActiveSubscription = useSubscriptionGate();
  
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
  const { checkAndIncrementUsage, remaining } = useLimitChecker("funilBusca");
  const { toast } = useToast();

  const handleSubmit = methods.handleSubmit(async (data) => {
    // Return early if no active subscription
    if (!hasActiveSubscription) return;
    
    // Check limits before submitting
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    await submitWebhook(data);
  });

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
    refetchHistorico,
    remaining,
    hasActiveSubscription
  };
};
