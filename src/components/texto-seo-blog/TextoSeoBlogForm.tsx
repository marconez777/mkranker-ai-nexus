
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextoSeoBlog } from "@/hooks/useTextoSeoBlog";
import { RenameAnalysisDialog } from "./RenameAnalysisDialog";
import { AnalysisHistoryList } from "./AnalysisHistoryList";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/fields/FormField";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ResultDisplay } from "@/components/forms/ResultDisplay";

export function TextoSeoBlogForm() {
  const { 
    methods, 
    isLoading, 
    resultado, 
    handleSubmit,
    analises,
    retryCount,
    handleRetry,
    handleDelete,
    handleRename,
    refetchHistorico
  } = useTextoSeoBlog();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<{ id: string; tema: string } | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [currentTab, setCurrentTab] = useState("form");

  const openRenameDialog = (analise: { id: string; tema: string }) => {
    setSelectedAnalise(analise);
    setIsRenameDialogOpen(true);
  };

  const handleRefetchHistorico = async () => {
    setIsRefetching(true);
    try {
      await refetchHistorico();
    } finally {
      setIsRefetching(false);
    }
  };

  return (
    <Card>
      <Tabs defaultValue="form" onValueChange={setCurrentTab}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Texto SEO para Blog</CardTitle>
            <CardDescription>
              Preencha as informações para gerar seu texto otimizado para blog
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  name="tema"
                  label="Tema"
                  placeholder="Digite o tema do texto"
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
            <AnalysisHistoryList
              analises={analises || []}
              onRefetch={handleRefetchHistorico}
              onDelete={handleDelete}
              onRename={openRenameDialog}
              isRefetching={isRefetching}
            />
          </CardContent>
        </TabsContent>
      </Tabs>

      <RenameAnalysisDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        selectedAnalise={selectedAnalise}
        onRename={handleRename}
      />
    </Card>
  );
}
