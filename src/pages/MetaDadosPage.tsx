
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetaDadosForm } from "@/components/meta-dados/MetaDadosForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

export default function MetaDadosPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit featureKey="metaDados" />
        <MetaDadosForm />
      </div>
    </DashboardLayout>
  );
}
