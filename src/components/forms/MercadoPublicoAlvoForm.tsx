
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useMercadoPublicoAlvo } from "@/hooks/useMercadoPublicoAlvo";
import { FormField } from "./fields/FormField";
import { FormTextarea } from "./fields/FormTextarea";
import { SegmentosInput } from "./SegmentosInput";
import { ErrorDisplay } from "./ErrorDisplay";
import { ResultDisplay } from "./ResultDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MercadoPublicoAlvoForm() {
  const {
    methods,
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit,
    handleRetry,
    analises
  } = useMercadoPublicoAlvo();

  return (
    <Card className="w-full">
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Mercado e Público Alvo</CardTitle>
            <CardDescription>
              Preencha as informações abaixo e clique em gerar
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="form">Formulário</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="form">
          <CardContent className="space-y-4 pt-4">
            <Form {...methods}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  name="nicho"
                  label="Qual o seu Nicho:"
                  placeholder="Ex: Marketing digital"
                  required
                />

                <FormField
                  name="servicoFoco"
                  label="Qual o Serviço em Foco:"
                  placeholder="Ex: Tráfego pago"
                  required
                />

                <SegmentosInput
                  name="segmentos"
                  label="Quais são seus segmentos:"
                  placeholder="Ex: Agência, Freelancer, Empresa..."
                  required
                />

                <FormTextarea
                  name="problema"
                  label="Problema ou Necessidade:"
                  placeholder="Ex: Não está vendendo o quanto gostaria"
                  required
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : "Gerar"}
                </Button>
                
                <ErrorDisplay
                  message={errorMessage}
                  onRetry={handleRetry}
                  retryCount={retryCount}
                  isLoading={isLoading}
                />
                
                <ResultDisplay resultado={resultado} />
              </form>
            </Form>
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
                        <h4 className="text-base font-medium">{analise.nicho}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert mt-2">
                        <ReactMarkdown 
                          className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm prose-p:my-2"
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-5 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 text-sm leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="my-3 list-disc pl-5 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="my-3 list-decimal pl-5 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="text-sm ml-2" {...props} />
                          }}
                        >
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
