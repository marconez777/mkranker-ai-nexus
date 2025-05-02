
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PautasBlogForm } from "@/components/pautas-blog/PautasBlogForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const PautasBlogPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit feature="pautasBlog" />
        <PautasBlogForm />
      </div>
    </DashboardLayout>
  );
};

export default PautasBlogPage;
