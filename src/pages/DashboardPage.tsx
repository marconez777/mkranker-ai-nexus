
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { authInitialized } = useAuth();

  useEffect(() => {
    // Only start loading the dashboard content after auth is initialized
    if (authInitialized) {
      // Simulate loading time for components
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [authInitialized]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 w-full">
          <DashboardTabs />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
