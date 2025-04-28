
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PalavrasChavesForm } from "@/components/palavras-chaves/PalavrasChavesForm";

const PalavrasChavesPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6 text-left">
        <h1 className="text-3xl font-bold tracking-tight">Palavras Chaves</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <PalavrasChavesForm />
      </div>
    </DashboardLayout>
  );
};

export default PalavrasChavesPage;
