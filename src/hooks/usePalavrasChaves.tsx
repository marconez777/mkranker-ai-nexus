
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
    
    // Pass the data directly to webhookSubmit which expects the form data
    await webhookSubmit(data);
  });

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount < 3) {
      // Call the handleSubmit function to get current form data and pass it to webhookSubmit
      methods.handleSubmit((formData: PalavrasChavesFormData) => webhookSubmit(formData))();
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
