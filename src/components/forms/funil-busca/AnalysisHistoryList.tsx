
import { RefreshCw, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultDisplay } from "../ResultDisplay";

interface Analysis {
  id: string;
  micro_nicho: string;
  created_at: string;
  resultado: string;
}

interface AnalysisHistoryListProps {
  analises: Analysis[];
  onRefetch: () => void;
  onDelete: (id: string) => void;
  onRename: (analise: { id: string; micro_nicho: string }) => void;
  isRefetching?: boolean;
}

export const AnalysisHistoryList = ({
  analises,
  onRefetch,
  onDelete,
  onRename,
  isRefetching = false
}: AnalysisHistoryListProps) => {
  if (!analises?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma análise encontrada. Crie sua primeira análise na aba Formulário.
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefetch}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Atualizando...' : 'Tentar atualizar'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {analises.length} {analises.length === 1 ? 'análise encontrada' : 'análises encontradas'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefetch}
          disabled={isRefetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {analises.map((analise) => (
          <AccordionItem key={analise.id} value={analise.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <h4 className="text-base font-medium">{analise.micro_nicho}</h4>
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
                  onClick={() => onRename(analise)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Renomear
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(analise.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
              <ResultDisplay resultado={analise.resultado} type="funil" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
