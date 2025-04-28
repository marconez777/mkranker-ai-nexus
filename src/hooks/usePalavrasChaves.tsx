
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
    handleSubmit: webhookSubmit,
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  } = usePalavrasChavesWebhook();
  
  const { checkAndIncrementUsage, remaining } = useLimitChecker("palavrasChaves");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const handleSubmit = methods.handleSubmit(async (data: PalavrasChavesFormData) => {
    // Check limits before submitting
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    try {
      // Call the underlying webhook submit function, which should accept form data directly
      await webhookSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  });

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      // Get current form values and submit them
      const currentValues = methods.getValues();
      // Make sure we're calling the webhook submit with form data, not an event
      webhookSubmit(currentValues as PalavrasChavesFormData);
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
