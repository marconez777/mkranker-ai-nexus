
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetaDadosForm } from "@/components/meta-dados/MetaDadosForm";

export default function MetaDadosPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Meta Dados</h1>
        <p className="text-muted-foreground">
          Gere meta dados otimizados para suas páginas
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        <MetaDadosForm />
      </div>
    </DashboardLayout>
  );
}
