
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoLpForm } from "@/components/texto-seo-lp/TextoSeoLpForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const TextoSeoLpPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit featureKey="textoSeoLp" />
        <TextoSeoLpForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoLpPage;
