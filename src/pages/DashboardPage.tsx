
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardTabs />
    </DashboardLayout>
  );
};

export default DashboardPage;
