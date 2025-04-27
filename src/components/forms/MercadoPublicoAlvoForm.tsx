
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

  const [expandedAnalise, setExpandedAnalise] = useState<string | null>(null);

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
              <div className="space-y-2">
                {analises.map((analise) => (
                  <Card key={analise.id} className="border-0 shadow-sm">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{analise.nicho}</CardTitle>
                          <CardDescription>
                            {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setExpandedAnalise(expandedAnalise === analise.id ? null : analise.id)}
                        >
                          {expandedAnalise === analise.id ? "Fechar" : "Ver análise"}
                        </Button>
                      </div>
                    </CardHeader>
                    {expandedAnalise === analise.id && (
                      <CardContent className="px-4 pb-4">
                        <div className="rounded-md bg-muted p-4">
                          <ReactMarkdown 
                            className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-5 mb-3" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2" {...props} />,
                              p: ({node, ...props}) => <p className="mb-4 text-sm leading-relaxed" {...props} />,
                              ul: ({node, ...props}) => <ul className="my-4 list-disc pl-5 space-y-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="my-4 list-decimal pl-5 space-y-2" {...props} />,
                              li: ({node, ...props}) => <li className="text-sm" {...props} />
                            }}
                          >
                            {analise.resultado}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
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
