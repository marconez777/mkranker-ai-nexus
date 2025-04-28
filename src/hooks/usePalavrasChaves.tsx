
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
      // We need to call the underlying webhook handler directly with the form data
      await webhookSubmitHandler(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  });

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      // For retry, manually trigger the form submission with current values
      const currentFormValues = methods.getValues();
      
      // Create a handler that takes the form data and calls webhookSubmitHandler
      const submitHandler = (data: PalavrasChavesFormData) => {
        webhookSubmitHandler(data);
      };
      
      // Use React Hook Form's handleSubmit to process the form data correctly
      // and then call our submitHandler
      methods.handleSubmit(submitHandler)();
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
