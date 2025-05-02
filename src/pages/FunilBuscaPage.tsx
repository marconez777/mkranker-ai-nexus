
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FunilBuscaForm } from "@/components/forms/FunilBuscaForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const FunilBuscaPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit featureKey="funilBusca" />
        <FunilBuscaForm />
      </div>
    </DashboardLayout>
  );
};

export default FunilBuscaPage;
