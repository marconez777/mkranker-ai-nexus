
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/fields/FormField";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { Button } from "@/components/ui/button";
import { RefreshCw, Edit, Trash } from "lucide-react";
import { useTextoSeoLp } from "@/hooks/useTextoSeoLp";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function TextoSeoLpForm() {
  const { methods, isLoading, resultado, handleSubmit, analises, handleDelete, handleRename } = useTextoSeoLp();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<{ id: string; tema: string } | null>(null);
  const [newTema, setNewTema] = useState("");

  const openRenameDialog = (analise: { id: string; tema: string }) => {
    setSelectedAnalise(analise);
    setNewTema(analise.tema);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (selectedAnalise && newTema.trim()) {
      await handleRename(selectedAnalise.id, newTema);
      setIsRenameDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
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
              <Accordion type="single" collapsible className="w-full">
                {analises.map((analise) => (
                  <AccordionItem key={analise.id} value={analise.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                        <h4 className="text-base font-medium">{analise.tema}</h4>
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
                Nenhuma análise encontrada. Crie seu primeiro texto na aba Formulário.
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
              value={newTema}
              onChange={(e) => setNewTema(e.target.value)}
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
