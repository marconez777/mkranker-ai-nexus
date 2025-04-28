
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoLpForm } from "@/components/forms/TextoSeoLpForm";

const TextoSeoLpPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <TextoSeoLpForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoLpPage;
