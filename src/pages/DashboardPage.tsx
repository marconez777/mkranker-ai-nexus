
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6 w-full">
        <h1 className="text-3xl font-bold tracking-tight text-left">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <DashboardTabs />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
