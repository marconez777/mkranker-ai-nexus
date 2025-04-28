
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePalavrasChaves } from "@/hooks/usePalavrasChaves";
import { RenameAnalysisDialog } from "./palavras-chaves-dialog/RenameAnalysisDialog";
import { AnalysisHistoryList } from "./AnalysisHistoryList";
import { PalavrasChavesFormFields } from "./PalavrasChavesFormFields";
import { PalavrasChavesToolbar } from "./PalavrasChavesToolbar";

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
      <Tabs defaultValue="form">
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
          <CardContent className="space-y-4 pt-4">
            <PalavrasChavesFormFields
              methods={methods}
              isLoading={isLoading}
              resultado={resultado}
              errorMessage={errorMessage}
              retryCount={retryCount}
              onSubmit={handleSubmit}
              onRetry={handleRetry}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="historico">
          <CardContent className="space-y-4 pt-4">
            <PalavrasChavesToolbar
              analysisCount={analises?.length || 0}
              onRefetch={handleRefetchHistorico}
              isRefetching={isRefetching}
            />
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
