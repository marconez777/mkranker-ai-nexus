
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PalavrasChavesToolbarProps {
  analysisCount: number;
  onRefetch: () => void;
  isRefetching: boolean;
}

export function PalavrasChavesToolbar({
  analysisCount,
  onRefetch,
  isRefetching
}: PalavrasChavesToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-sm text-muted-foreground">
        {analysisCount} {analysisCount === 1 ? 'análise encontrada' : 'análises encontradas'}
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefetch}
        disabled={isRefetching}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
        {isRefetching ? 'Atualizando...' : 'Atualizar'}
      </Button>
    </div>
  );
}
