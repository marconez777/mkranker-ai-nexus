
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/fields/FormField";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMetaDados } from "@/hooks/useMetaDados";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MetaDadosForm() {
  const { methods, isLoading, resultado, handleSubmit, analises } = useMetaDados();

  return (
    <Card>
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Meta Dados</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para gerar meta dados otimizados
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
                  name="nomeSite"
                  label="Nome da Empresa / Loja / Blog"
                  placeholder="Digite o nome do seu site"
                  required
                />
                
                <FormField
                  name="palavraChaveFoco"
                  label="Palavra Chave em Foco"
                  placeholder="Digite a palavra-chave principal"
                  required
                />
                
                <FormField
                  name="palavraRelacionada"
                  label="Palavra Relacionada"
                  placeholder="Digite uma palavra-chave relacionada"
                  required
                />
                
                <FormField
                  name="tipoPagina"
                  label="Tipo de Página"
                  placeholder="Ex: Homepage, Blog, Produto..."
                  required
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando meta dados...
                    </>
                  ) : "Gerar Meta Dados"}
                </Button>
              </form>
            </Form>
            
            <ResultDisplay resultado={resultado} type="texto" />
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
                        <h4 className="text-base font-medium">{analise.nome_site}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ResultDisplay resultado={analise.resultado} type="texto" />
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
