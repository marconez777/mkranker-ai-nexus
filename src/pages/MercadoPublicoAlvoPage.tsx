
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MercadoPublicoAlvoForm } from "@/components/forms/MercadoPublicoAlvoForm";

const MercadoPublicoAlvoPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <MercadoPublicoAlvoForm />
      </div>
    </DashboardLayout>
  );
};

export default MercadoPublicoAlvoPage;
