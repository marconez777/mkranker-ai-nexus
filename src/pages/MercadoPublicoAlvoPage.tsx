
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MercadoPublicoAlvoForm } from "@/components/forms/MercadoPublicoAlvoForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const MercadoPublicoAlvoPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit featureKey="mercadoPublicoAlvo" />
        <MercadoPublicoAlvoForm />
      </div>
    </DashboardLayout>
  );
};

export default MercadoPublicoAlvoPage;
