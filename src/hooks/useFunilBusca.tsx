
import { useFormManager } from "./funil-busca/useFormManager";
import { useHistoryManager } from "./funil-busca/useHistoryManager";
import { useWebhookHandler } from "./funil-busca/useWebhookHandler";
import { useLimitChecker } from "./useLimitChecker";
import { useToast } from "./use-toast";

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
  const { checkAndIncrementUsage, remaining } = useLimitChecker("funilBusca");
  const { toast } = useToast();

  const handleSubmit = methods.handleSubmit(async (data) => {
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
    remaining
  };
};
