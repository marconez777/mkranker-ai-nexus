
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { usePalavrasChavesWebhook } from "@/hooks/usePalavrasChavesWebhook";
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PalavrasChavesForm() {
  const { methods, isLoading, resultado, requestData, handleSubmit, analises } = usePalavrasChavesWebhook();

  return (
    <Card>
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Palavras Chaves</CardTitle>
            <CardDescription>
              Análise de palavras-chave via webhook externo
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="form">Formulário</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="form">
          <CardContent className="space-y-4">
            <Form {...methods}>
              <form onSubmit={handleSubmit} className="space-y-6">
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
              </form>
            </Form>

            {requestData && (
              <Alert className="bg-slate-50 border-slate-200 mt-4">
                <Code className="h-4 w-4" />
                <AlertDescription>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Dados enviados para o webhook:</h4>
                    <pre className="mt-1 bg-slate-100 p-2 rounded text-xs overflow-auto max-h-32">
                      {requestData}
                    </pre>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {resultado && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Resultado da Análise</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert bg-slate-50 p-4 rounded-md border">
                  <ReactMarkdown components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-6 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-sm leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="my-4 list-disc pl-5 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-sm ml-2 mb-2" {...props} />
                  }}>
                    {resultado}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="historico">
          <CardContent className="space-y-4 pt-4">
            {analises && analises.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {analises.map((analise) => (
                  <AccordionItem key={analise.id} value={analise.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                        <h4 className="text-base font-medium">{`Análise de ${format(new Date(analise.created_at), "dd/MM/yyyy")}`}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert bg-slate-50 p-4 rounded-md border">
                        <ReactMarkdown components={{
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-6 mb-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4 text-sm leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="my-4 list-disc pl-5 space-y-2" {...props} />,
                          li: ({node, ...props}) => <li className="text-sm ml-2 mb-2" {...props} />
                        }}>
                          {analise.resultado}
                        </ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma análise encontrada. Crie sua primeira análise na aba Formulário.
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
