
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoLpForm } from "@/components/texto-seo-lp/TextoSeoLpForm";

const TextoSeoLpPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Texto SEO para LP</h1>
        <p className="text-muted-foreground">
          Crie textos otimizados para SEO em suas Landing Pages
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <TextoSeoLpForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoLpPage;
