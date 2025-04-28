
import { usePalavrasChavesWebhook } from "./usePalavrasChavesWebhook";
import { useState } from "react";
import { PalavrasChavesFormData } from "@/types/palavras-chaves";

export const usePalavrasChaves = () => {
  const {
    methods,
    isLoading,
    resultado,
    requestData,
    onSubmit: webhookOnSubmit,
    analises,
    refetchHistorico,
    handleDelete,
    handleRename
  } = usePalavrasChavesWebhook();
  
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Função para lidar com o envio do formulário
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Use React Hook Form's handleSubmit para processar o formulário
    methods.handleSubmit((formData: PalavrasChavesFormData) => {
      try {
        // Chama o processador do webhook com os dados do formulário
        webhookOnSubmit(formData);
      } catch (error) {
        console.error("Error in webhook submission:", error);
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      }
    })(event);
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      try {
        const formElement = document.getElementById('palavras-form') as HTMLFormElement;
        if (formElement) {
          formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
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
    errorMessage,
    retryCount,
    handleRetry
  };
};
