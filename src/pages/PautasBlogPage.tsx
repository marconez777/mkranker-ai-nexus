
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PautasBlogForm } from "@/components/pautas-blog/PautasBlogForm";

const PautasBlogPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pautas para Blog</h1>
        <p className="text-muted-foreground">
          Gere sugestões de pautas para seu blog
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <PautasBlogForm />
      </div>
    </DashboardLayout>
  );
};

export default PautasBlogPage;
