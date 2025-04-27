
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/fields/FormField";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTextoSeoLp } from "@/hooks/useTextoSeoLp";
import { ResultDisplay } from "@/components/forms/ResultDisplay";

export function TextoSeoLpForm() {
  const { methods, isLoading, resultado, handleSubmit, analises } = useTextoSeoLp();

  return (
    <Card>
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Texto SEO para LP</CardTitle>
            <CardDescription>
              Preencha as informações para gerar seu texto otimizado
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
                  name="tema"
                  label="Tema do artigo"
                  placeholder="Digite o tema do seu artigo"
                  required
                />
                
                <FormField
                  name="palavraChave"
                  label="Palavra-chave em Foco"
                  placeholder="Digite a palavra-chave principal"
                  required
                />
                
                <FormTextarea
                  name="palavrasRelacionadas"
                  label="Palavras-chave Relacionadas"
                  placeholder="Digite uma palavra-chave por linha"
                  required
                />
                
                <FormTextarea
                  name="observacoes"
                  label="Observações Relevantes (Opcional)"
                  placeholder="Adicione informações adicionais ou contexto específico"
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando texto...
                    </>
                  ) : "Gerar texto"}
                </Button>
              </form>
            </Form>
            
            <ResultDisplay resultado={resultado} type="texto" />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="historico">
          <CardContent className="space-y-4 pt-4">
            {analises && analises.length > 0 ? (
              <div className="space-y-4">
                {analises.map((analise) => (
                  <div key={analise.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{analise.tema}</h3>
                    <ResultDisplay resultado={analise.resultado} type="texto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma análise encontrada. Crie seu primeiro texto na aba Formulário.
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
