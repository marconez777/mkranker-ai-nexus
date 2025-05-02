
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetaDadosForm } from "@/components/meta-dados/MetaDadosForm";
import { UsageLimit } from "@/components/ui/UsageLimit";
import { usePlan } from "@/contexts/PlanContext";

export default function MetaDadosPage() {
  const { getRemainingUses } = usePlan();
  const remaining = getRemainingUses("metaDados");
  
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit feature="metaDados" />
        <MetaDadosForm />
      </div>
    </DashboardLayout>
  );
}
