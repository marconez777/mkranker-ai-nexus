
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FunilBuscaForm } from "@/components/forms/FunilBuscaForm";

const FunilBuscaPage = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 text-left">
        <h1 className="text-3xl font-bold tracking-tight">Funil de Busca</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <FunilBuscaForm />
      </div>
    </DashboardLayout>
  );
};

export default FunilBuscaPage;
