
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
    handleSubmit: webhookOnSubmit,
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  } = usePalavrasChavesWebhook();
  
  const { checkAndIncrementUsage, remaining } = useLimitChecker("palavrasChaves");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Wrap the webhook's submit handler with our own logic
  const onSubmit = async (formData: PalavrasChavesFormData) => {
    // Check limits before submitting
    const canProceed = await checkAndIncrementUsage();
    
    if (!canProceed) {
      return;
    }
    
    try {
      // Call the webhookSubmitHandler with the form data
      webhookOnSubmit(formData);
    } catch (error) {
      console.error("Error in webhook submission:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  // Create a handler for form submission events
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Use React Hook Form's handleSubmit with our onSubmit function
    methods.handleSubmit(onSubmit)(event);
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      try {
        const formElement = document.getElementById('palavras-form') as HTMLFormElement;
        if (formElement) {
          // Create a proper submit event
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          
          // Add preventDefault method to make it compatible with React's FormEvent
          Object.defineProperty(submitEvent, 'preventDefault', {
            value: () => {},
            enumerable: true
          });
          
          // Add currentTarget property that React's FormEvent expects
          Object.defineProperty(submitEvent, 'currentTarget', {
            value: formElement,
            enumerable: true
          });
          
          // Cast to React.FormEvent<HTMLFormElement> after adding required properties
          const reactSubmitEvent = submitEvent as unknown as React.FormEvent<HTMLFormElement>;
          
          // Call handleSubmit with this proper event
          handleSubmit(reactSubmitEvent);
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
