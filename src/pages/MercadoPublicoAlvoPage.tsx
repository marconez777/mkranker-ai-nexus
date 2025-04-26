
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MercadoPublicoAlvoForm } from "@/components/forms/MercadoPublicoAlvoForm";

const MercadoPublicoAlvoPage = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mercado e Público Alvo</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <MercadoPublicoAlvoForm />
      </div>
    </DashboardLayout>
  );
};

export default MercadoPublicoAlvoPage;
