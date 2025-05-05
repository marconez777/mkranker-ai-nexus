
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { SubscriptionAlertBanner } from "@/components/dashboard/SubscriptionAlertBanner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { session, authInitialized } = useAuth();
  const { refreshPlan } = usePlan();

  // Add debugging
  console.log("DashboardPage render - estado auth:", { 
    sessionExists: !!session, 
    authInitialized
  });

  useEffect(() => {
    // If auth is not initialized yet, keep loading
    if (!authInitialized) {
      console.log("Auth não inicializada ainda no dashboard, mantendo estado de carregamento");
      return;
    }

    // If no session, don't try to load content - redirection will be handled by DashboardLayout
    if (!session) {
      console.log("Sem sessão no dashboard, mantendo estado de carregamento");
      return;
    }

    // Refresh plan data when dashboard loads
    refreshPlan().catch(err => {
      console.error("Erro ao atualizar dados do plano:", err);
    });

    // Simulate loading time for components (simplified)
    const timer = setTimeout(() => {
      console.log("Conteúdo do dashboard carregado");
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [session, authInitialized, refreshPlan]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 w-full">
          <DashboardHeader />
          <SubscriptionAlertBanner />
          <DashboardTabs />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
