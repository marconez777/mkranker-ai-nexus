
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFunilBusca } from "@/hooks/useFunilBusca";
import { FunilBuscaFormFields } from "./funil-busca/FunilBuscaFormFields";
import { AnalysisHistoryList } from "./funil-busca/AnalysisHistoryList";
import { RenameAnalysisDialog } from "./funil-busca/RenameAnalysisDialog";
import { useEffect } from "react";

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
  const [isRefetching, setIsRefetching] = useState(false);
  const [currentTab, setCurrentTab] = useState("form");

  const openRenameDialog = (analise: { id: string; micro_nicho: string }) => {
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

  // Auto-refresh when switching to the history tab
  useEffect(() => {
    if (currentTab === "historico") {
      handleRefetchHistorico();
    }
  }, [currentTab]);

  return (
    <Card className="w-full">
      <Tabs defaultValue="form" onValueChange={setCurrentTab}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Funil de Busca</CardTitle>
            <CardDescription>
              Preencha as informações abaixo e clique em gerar
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
            <FunilBuscaFormFields
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
