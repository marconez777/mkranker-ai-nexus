
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetaDadosForm } from "@/components/meta-dados/MetaDadosForm";

export default function MetaDadosPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Meta Dados</h1>
        <MetaDadosForm />
      </div>
    </DashboardLayout>
  );
}
