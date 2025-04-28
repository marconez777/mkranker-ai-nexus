
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PautasBlogForm } from "@/components/pautas-blog/PautasBlogForm";

const PautasBlogPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <PautasBlogForm />
      </div>
    </DashboardLayout>
  );
};

export default PautasBlogPage;
