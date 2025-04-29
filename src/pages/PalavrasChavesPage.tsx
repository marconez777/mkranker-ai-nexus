
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PalavrasChavesForm } from "@/components/palavras-chaves/PalavrasChavesForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const PalavrasChavesPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4 mr-2" />
          <AlertDescription>
            Pesquisa de palavras-chave relacionadas - Digite uma palavra-chave para obter sugestões
          </AlertDescription>
        </Alert>
        <PalavrasChavesForm />
      </div>
    </DashboardLayout>
  );
};

export default PalavrasChavesPage;
