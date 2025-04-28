
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PalavrasChavesForm } from "@/components/palavras-chaves/PalavrasChavesForm";

const PalavrasChavesPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <PalavrasChavesForm />
      </div>
    </DashboardLayout>
  );
};

export default PalavrasChavesPage;
