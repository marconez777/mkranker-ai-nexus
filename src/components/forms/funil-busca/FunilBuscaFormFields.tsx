
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../fields/FormField";
import { ErrorDisplay } from "../ErrorDisplay";
import { ResultDisplay } from "../ResultDisplay";
import { UseFormReturn } from "react-hook-form";
import { FunilBuscaFormData } from "@/types/funil-busca";

interface FunilBuscaFormFieldsProps {
  methods: UseFormReturn<FunilBuscaFormData>;
  isLoading: boolean;
  resultado: string;
  errorMessage: string;
  retryCount: number;
  onSubmit: () => void;
  onRetry: () => void;
}

export const FunilBuscaFormFields = ({
  methods,
  isLoading,
  resultado,
  errorMessage,
  retryCount,
  onSubmit,
  onRetry
}: FunilBuscaFormFieldsProps) => {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          name="microNicho"
          label="Qual o seu Micro Nicho:"
          placeholder="Ex: Soluções de Automação de Marketing"
          required
        />

        <FormField
          name="publicoAlvo"
          label="Qual o Público Alvo:"
          placeholder="Ex: empreendedores"
          required
        />

        <FormField
          name="segmento"
          label="Qual o seu segmento:"
          placeholder="Ex: Agência, Freelancer, Empresa..."
          required
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : "Palavras-Chave"}
        </Button>
        
        <ErrorDisplay
          message={errorMessage}
          onRetry={onRetry}
          retryCount={retryCount}
          isLoading={isLoading}
        />
        
        <ResultDisplay resultado={resultado} type="funil" />
      </form>
    </Form>
  );
};
