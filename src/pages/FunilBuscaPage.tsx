
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FunilBuscaForm } from "@/components/forms/FunilBuscaForm";

const FunilBuscaPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6 text-left w-full">
        <h1 className="text-3xl font-bold tracking-tight">Funil de Busca</h1>
        <p className="text-muted-foreground">
          Analise o funil de busca para seu negócio
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <FunilBuscaForm />
      </div>
    </DashboardLayout>
  );
};

export default FunilBuscaPage;
