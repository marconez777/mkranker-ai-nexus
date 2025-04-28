
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
    
    try {
      // Use React Hook Form's handleSubmit to get the data and then pass to webhook handler
      const onValid = async (data: PalavrasChavesFormData) => {
        try {
          // Pass the form data to the webhook handler directly
          await methods.handleSubmit((formData) => webhookSubmitHandler(formData))(event);
        } catch (error) {
          console.error("Error in webhook submission:", error);
          setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
        }
      };
      
      // Call the handler with the event
      methods.handleSubmit(onValid)(event);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      // For retry, manually trigger the form submission
      try {
        // Create a synthetic event-like object that React Hook Form can process
        const fakeEvent = {
          preventDefault: () => {},
          target: document.getElementById('palavras-form')
        } as unknown as React.FormEvent<HTMLFormElement>;
        
        // Call our main submit handler with this fake event
        handleSubmit(fakeEvent);
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
