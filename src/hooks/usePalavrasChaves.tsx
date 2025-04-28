
import { usePalavrasChavesWebhook } from "./usePalavrasChavesWebhook";
import { useLimitChecker } from "./useLimitChecker";
import { useState } from "react";
import { PalavrasChavesFormData } from "@/types/palavras-chaves";

export const usePalavrasChaves = () => {
  const {
    methods,
    isLoading,
    resultado,
    requestData,
    handleSubmit: webhookSubmitHandler,
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  } = usePalavrasChavesWebhook();
  
  const { checkAndIncrementUsage, remaining } = useLimitChecker("palavrasChaves");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Here we're wrapping the webhook's submit handler with our own logic
  const handleSubmit = methods.handleSubmit(async (data: PalavrasChavesFormData) => {
    // Check limits before submitting
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    try {
      // We need to call the underlying submit handler directly
      // Since methods.handleSubmit already returns the form data properly,
      // we just need to pass it along to the original handler function
      await webhookSubmitHandler(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  });

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      // For retry, we get the current form values and manually submit them
      const currentValues = methods.getValues();
      
      // We need to wrap this in our own methods.handleSubmit to ensure proper form data handling
      methods.handleSubmit((data) => {
        webhookSubmitHandler(data);
      })(currentValues as any); // Use 'as any' to bypass the synthetic event requirement
    }
  };

  return {
    methods,
    isLoading,
    resultado,
    requestData,
    handleSubmit,
    analises,
    refetchHistorico,
    handleDelete,
    handleRename,
    remaining,
    errorMessage,
    retryCount,
    handleRetry
  };
};
