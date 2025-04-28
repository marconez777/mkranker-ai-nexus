
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetaDadosForm } from "@/components/meta-dados/MetaDadosForm";

export default function MetaDadosPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <MetaDadosForm />
      </div>
    </DashboardLayout>
  );
}
