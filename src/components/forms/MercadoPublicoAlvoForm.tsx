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
              <div className="space-y-4">
                {analises.map((analise) => (
                  <div key={analise.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{analise.nicho}</h4>
                        <p className="text-sm text-gray-500">{analise.servico_foco}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="mt-4">
                      <ReactMarkdown 
                        className="prose max-w-none prose-sm prose-headings:mb-2 prose-headings:mt-4"
                        components={{
                          h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-2 mt-4" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-medium mb-2 mt-3" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="text-gray-700 text-sm" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 text-gray-700 text-sm leading-relaxed" {...props} />
                        }}
                      >
                        {analise.resultado}
                      </ReactMarkdown>
                    </div>
                  </div>
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
