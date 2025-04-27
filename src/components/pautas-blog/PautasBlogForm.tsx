
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/fields/FormField";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePautasBlog } from "@/hooks/usePautasBlog";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { ErrorDisplay } from "@/components/forms/ErrorDisplay";

export function PautasBlogForm() {
  const { methods, isLoading, resultado, handleSubmit, analises, retryCount, handleRetry } = usePautasBlog();

  return (
    <Card>
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Sugestão de Pautas</CardTitle>
            <CardDescription>
              Gere ideias de conteúdo para seu blog
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
                  name="palavraChave"
                  label="Palavra-chave"
                  placeholder="Digite a palavra-chave principal"
                  required
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando sugestões...
                    </>
                  ) : "Gerar sugestões"}
                </Button>
              </form>
            </Form>
            
            {!resultado && !isLoading && retryCount > 0 && (
              <ErrorDisplay 
                message="Ocorreu um erro na conexão com o webhook. Verifique a URL ou tente novamente." 
                onRetry={handleRetry}
                retryCount={retryCount}
                isLoading={isLoading}
              />
            )}
            
            <ResultDisplay resultado={resultado} type="texto" />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="historico">
          <CardContent className="space-y-4 pt-4">
            {analises && analises.length > 0 ? (
              <div className="space-y-4">
                {analises.map((analise) => (
                  <div key={analise.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{analise.palavra_chave}</h3>
                    <ResultDisplay resultado={analise.resultado} type="texto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma análise encontrada. Crie sua primeira pauta na aba Formulário.
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
