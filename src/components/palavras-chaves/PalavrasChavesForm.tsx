
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { usePalavrasChaves } from "@/hooks/usePalavrasChaves";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { ResultDisplay } from "@/components/forms/ResultDisplay";
import { RenameAnalysisDialog } from "./palavras-chaves-dialog/RenameAnalysisDialog";
import { AnalysisHistoryList } from "./AnalysisHistoryList";

export function PalavrasChavesForm() {
  const {
    methods,
    isLoading,
    resultado,
    handleSubmit,
    analises,
    refetchHistorico,
    handleDelete,
    handleRename,
    errorMessage,
    retryCount,
    handleRetry
  } = usePalavrasChaves();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<{ id: string; palavras_fundo: string[] } | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [currentTab, setCurrentTab] = useState("form");

  const openRenameDialog = (analise: { id: string; palavras_fundo: string[] }) => {
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
            <CardTitle>Palavras Chaves</CardTitle>
            <CardDescription>
              Preencha as palavras-chave abaixo e clique em analisar
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
          <CardContent className="space-y-4">
            <Form {...methods}>
              <form id="palavras-form" onSubmit={handleSubmit} className="space-y-6">
                <FormTextarea
                  name="palavrasFundo"
                  label="Digite suas palavras-chave:"
                  placeholder="Digite uma palavra-chave por linha (ex: marketing digital)"
                  required
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analisando...
                    </>
                  ) : "Analisar Palavras"}
                </Button>
                
                {errorMessage && (
                  <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                    <p className="font-medium">Erro: {errorMessage}</p>
                    {retryCount < 3 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRetry}
                        className="mt-2"
                      >
                        Tentar novamente
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </Form>

            {resultado && (
              <ResultDisplay resultado={resultado} type="palavras" />
            )}
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
