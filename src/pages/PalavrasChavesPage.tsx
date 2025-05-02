
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PalavrasChavesForm } from "@/components/palavras-chaves/PalavrasChavesForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const PalavrasChavesPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit featureKey="palavrasChaves" />
        <PalavrasChavesForm />
      </div>
    </DashboardLayout>
  );
};

export default PalavrasChavesPage;
