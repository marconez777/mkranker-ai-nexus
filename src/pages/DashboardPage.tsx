
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  // Add debugging
  console.log("DashboardPage render - session exists:", !!session);

  useEffect(() => {
    // If no session, don't try to load content
    if (!session) {
      console.log("No session in dashboard, staying in loading state");
      return;
    }

    // Simulate loading time for components (simplified)
    const timer = setTimeout(() => {
      console.log("Dashboard content loaded");
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [session]);

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
