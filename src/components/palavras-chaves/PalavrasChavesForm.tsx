
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePalavrasChaves } from "@/hooks/usePalavrasChaves";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";
import { ErrorDisplay } from "@/components/forms/ErrorDisplay";
import { FormField } from "../forms/fields/FormField";
import { Skeleton } from "../ui/skeleton";

export function PalavrasChavesForm() {
  const { methods, isLoading, resultado, handleSubmit, analises, retryCount, handleRetry, handleDelete, handleRename, isHistoryLoading, refetchHistorico } = usePalavrasChaves();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<{ id: string; palavras_chave: string } | null>(null);
  const [newPalavraChave, setNewPalavraChave] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTab, setCurrentTab] = useState("form");
  const [isRefetching, setIsRefetching] = useState(false);

  const openRenameDialog = (analise: { id: string; palavras_chave: string }) => {
    setSelectedAnalise(analise);
    setNewPalavraChave(analise.palavras_chave);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (selectedAnalise && newPalavraChave.trim()) {
      await handleRename(selectedAnalise.id, newPalavraChave);
      setIsRenameDialogOpen(false);
    }
  };

  // Manual refetch handler
  const handleRefetchHistorico = async () => {
    setIsRefetching(true);
    try {
      await refetchHistorico();
    } finally {
      setIsRefetching(false);
    }
  };

  // Auto-refresh when switching to the history tab
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (value === "historico") {
      handleRefetchHistorico();
    }
  };

  // Override do handleSubmit para capturar erros e definir mensagem de erro
  const onSubmit = async (data: any) => {
    try {
      setErrorMessage("");
      await handleSubmit(data);
    } catch (error: any) {
      setErrorMessage(error.message || "Ocorreu um erro ao processar sua solicitação");
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="form" onValueChange={handleTabChange}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
          <div>
            <CardTitle>Palavras-chave Relacionadas</CardTitle>
            <CardDescription>
              Digite uma palavra-chave para gerar sugestões relacionadas
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="form">Formulário</TabsTrigger>
            <TabsTrigger value="historico">
              Histórico {analises?.length ? `(${analises.length})` : ''}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="form">
          <CardContent className="space-y-4 pt-4">
            <Form {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="palavraChave"
                  label="Palavra-chave em Foco"
                  placeholder="Digite uma palavra-chave"
                  required
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando palavras relacionadas...
                    </>
                  ) : "Gerar Palavras Relacionadas"}
                </Button>
              </form>
            </Form>
            
            <ErrorDisplay 
              message={errorMessage}
              onRetry={handleRetry}
              retryCount={retryCount}
              isLoading={isLoading}
            />
            
            <ResultDisplay resultado={resultado} type="palavras" />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="historico">
          <CardContent className="space-y-4 pt-4">
            {isHistoryLoading || isRefetching ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-8 w-[100px]" />
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            ) : analises && analises.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {analises.length} {analises.length === 1 ? 'análise encontrada' : 'análises encontradas'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefetchHistorico}
                    disabled={isRefetching}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                    {isRefetching ? 'Atualizando...' : 'Atualizar'}
                  </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {analises.map((analise) => (
                    <AccordionItem key={analise.id} value={analise.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                          <h4 className="text-base font-medium">{analise.palavras_chave}</h4>
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
                        <ResultDisplay resultado={analise.resultado} type="palavras" />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma análise encontrada. Crie sua primeira análise na aba Formulário.
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefetchHistorico}
                    disabled={isRefetching}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                    {isRefetching ? 'Atualizando...' : 'Tentar atualizar'}
                  </Button>
                </div>
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
