import { RefreshCw, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useFunilBusca } from "@/hooks/useFunilBusca";
import { FormField } from "./fields/FormField";
import { ErrorDisplay } from "./ErrorDisplay";
import { ResultDisplay } from "./ResultDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function FunilBuscaForm() {
  const {
    methods,
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    handleSubmit,
    handleRetry,
    handleDelete,
    handleRename,
    analises,
    refetchHistorico
  } = useFunilBusca();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<{ id: string; micro_nicho: string } | null>(null);
  const [newMicroNicho, setNewMicroNicho] = useState("");

  const openRenameDialog = (analise: { id: string; micro_nicho: string }) => {
    setSelectedAnalise(analise);
    setNewMicroNicho(analise.micro_nicho);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (selectedAnalise && newMicroNicho.trim()) {
      await handleRename(selectedAnalise.id, newMicroNicho);
      setIsRenameDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Funil de Busca</CardTitle>
            <CardDescription>
              Preencha as informações abaixo e clique em gerar
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="form">Formulário</TabsTrigger>
            <TabsTrigger value="historico" onClick={() => refetchHistorico()}>
              Histórico {analises?.length ? `(${analises.length})` : ''}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="form">
          <CardContent className="space-y-4 pt-4">
            <Form {...methods}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  name="microNicho"
                  label="Qual o seu Micro Nicho:"
                  placeholder="Ex: Soluções de Automação de Marketing"
                  required
                />

                <FormField
                  name="publicoAlvo"
                  label="Qual o Público Alvo:"
                  placeholder="Ex: empreendedores"
                  required
                />

                <FormField
                  name="segmento"
                  label="Qual o seu segmento:"
                  placeholder="Ex: Agência, Freelancer, Empresa..."
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
                
                <ResultDisplay resultado={resultado} type="funil" />
              </form>
            </Form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="historico">
          <CardContent className="space-y-4 pt-4">
            {analises && analises.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {analises.length} {analises.length === 1 ? 'análise encontrada' : 'análises encontradas'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetchHistorico()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Atualizar
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Micro Nicho</TableHead>
                        <TableHead>Público Alvo</TableHead>
                        <TableHead>Segmento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analises.map((analise) => (
                        <TableRow key={analise.id}>
                          <TableCell>{analise.micro_nicho}</TableCell>
                          <TableCell>{analise.publico_alvo}</TableCell>
                          <TableCell>{analise.segmento}</TableCell>
                          <TableCell>
                            {format(new Date(analise.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openRenameDialog(analise)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Renomear</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(analise.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma análise encontrada. Crie sua primeira análise na aba Formulário.
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetchHistorico()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Tentar atualizar
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
              value={newMicroNicho}
              onChange={(e) => setNewMicroNicho(e.target.value)}
              placeholder="Novo nome"
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
