
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { usePalavrasChavesWebhook } from "@/hooks/usePalavrasChavesWebhook";
import ReactMarkdown from 'react-markdown';

export function PalavrasChavesForm() {
  const { methods, isLoading, resultado, handleSubmit } = usePalavrasChavesWebhook();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Palavras Chaves</CardTitle>
        <CardDescription>
          Análise de palavras-chave via webhook externo
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Form {...methods}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormTextarea
              name="palavrasFundo"
              label="Lista de palavras-chave:"
              placeholder="Digite uma palavra-chave por linha"
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
          </form>
        </Form>

        {resultado && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Resultado da Análise</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{resultado}</ReactMarkdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
