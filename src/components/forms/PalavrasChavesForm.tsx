
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { usePalavrasChaves } from "@/hooks/usePalavrasChaves";
import { FormTextarea } from "./fields/FormTextarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PalavrasChavesForm() {
  const {
    methods,
    isLoading,
    handleSubmit,
    analises
  } = usePalavrasChaves();

  return (
    <Card className="w-full">
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Palavras Chaves</CardTitle>
            <CardDescription>
              Insira suas palavras-chave do fundo do funil
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
                <FormTextarea
                  name="palavrasFundo"
                  label="Palavras-chave do fundo do funil:"
                  placeholder="Insira 5-7 palavras-chave (uma por linha)"
                  required
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : "Salvar"}
                </Button>
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
                        <h4 className="text-base font-medium">
                          {analise.palavras_fundo.length} palavras-chave
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4 space-y-1">
                        {analise.palavras_fundo.map((palavra, index) => (
                          <li key={index}>{palavra}</li>
                        ))}
                      </ul>
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
