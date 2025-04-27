
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/fields/FormField";
import { Button } from "@/components/ui/button";
import { RefreshCw, Edit, Trash } from "lucide-react";
import { usePautasBlog } from "@/hooks/usePautasBlog";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { ErrorDisplay } from "@/components/forms/ErrorDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PautasBlogForm() {
  const { methods, isLoading, resultado, handleSubmit, analises, retryCount, handleRetry, handleDelete, handleRename } = usePautasBlog();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<{ id: string; palavra_chave: string } | null>(null);
  const [newPalavraChave, setNewPalavraChave] = useState("");

  const openRenameDialog = (analise: { id: string; palavra_chave: string }) => {
    setSelectedAnalise(analise);
    setNewPalavraChave(analise.palavra_chave);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (selectedAnalise && newPalavraChave.trim()) {
      await handleRename(selectedAnalise.id, newPalavraChave);
      setIsRenameDialogOpen(false);
    }
  };

  return (
    <Card>
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Pautas para Blog</CardTitle>
            <CardDescription>
              Digite uma palavra-chave para gerar ideias de pautas
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
                      Gerando pautas...
                    </>
                  ) : "Gerar Pautas"}
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
              <Accordion type="single" collapsible className="w-full">
                {analises.map((analise) => (
                  <AccordionItem key={analise.id} value={analise.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                        <h4 className="text-base font-medium">{analise.palavra_chave}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-end gap-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRenameDialog(analise)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Renomear
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(analise.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
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

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear análise</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newPalavraChave}
              onChange={(e) => setNewPalavraChave(e.target.value)}
              placeholder="Nova palavra-chave"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRenameSubmit}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
