
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check limits before submitting
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    // Use React Hook Form's handleSubmit to process the form data
    methods.handleSubmit((formData) => {
      try {
        // Call the webhookSubmitHandler directly with the form data
        webhookSubmitHandler(formData);
      } catch (error) {
        console.error("Error in webhook submission:", error);
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      }
    })(event);
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      // For retry, we'll use the current form values
      try {
        const formElement = document.getElementById('palavras-form') as HTMLFormElement;
        if (formElement) {
          // Create a new submit event
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
          // Call our submit handler with the event
          handleSubmit(submitEvent);
        } else {
          console.error("Form element not found");
          setErrorMessage("Unable to retry - form not found");
        }
      } catch (error) {
        console.error("Error during retry:", error);
        setErrorMessage(error instanceof Error ? error.message : "Error during retry");
      }
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
