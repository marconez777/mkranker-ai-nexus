
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PalavrasChavesForm } from "@/components/palavras-chaves/PalavrasChavesForm";

const PalavrasChavesPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6 text-left w-full">
        <h1 className="text-3xl font-bold tracking-tight">Palavras Chaves</h1>
        <p className="text-muted-foreground">
          Analise suas palavras-chave para melhor otimização
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <PalavrasChavesForm />
      </div>
    </DashboardLayout>
  );
};

export default PalavrasChavesPage;
