
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ErrorDisplay } from "@/components/forms/ErrorDisplay";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { UseFormReturn } from "react-hook-form";
import { PalavrasChavesFormData } from "@/types/palavras-chaves";

interface PalavrasChavesFormFieldsProps {
  methods: UseFormReturn<PalavrasChavesFormData>;
  isLoading: boolean;
  resultado: string;
  errorMessage: string;
  retryCount: number;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
}

export function PalavrasChavesFormFields({
  methods,
  isLoading,
  resultado,
  errorMessage,
  retryCount,
  onSubmit,
  onRetry
}: PalavrasChavesFormFieldsProps) {
  return (
    <Form {...methods}>
      <form id="palavras-form" onSubmit={onSubmit} className="space-y-6 text-left">
        <FormTextarea
          name="palavrasFundo"
          label="Digite suas palavras-chave:"
          placeholder="Digite uma palavra-chave por linha (ex: marketing digital)"
          required
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : "Analisar Palavras"}
        </Button>
        
        <ErrorDisplay
          message={errorMessage}
          onRetry={onRetry}
          retryCount={retryCount}
          isLoading={isLoading}
        />
        
        <ResultDisplay resultado={resultado} type="palavras" />
      </form>
    </Form>
  );
}
