
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MercadoPublicoAlvoForm } from "@/components/forms/MercadoPublicoAlvoForm";

const MercadoPublicoAlvoPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6 text-left w-full">
        <h1 className="text-3xl font-bold tracking-tight">Mercado e Público Alvo</h1>
        <p className="text-muted-foreground">
          Analise seu mercado e público alvo
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <MercadoPublicoAlvoForm />
      </div>
    </DashboardLayout>
  );
};

export default MercadoPublicoAlvoPage;
