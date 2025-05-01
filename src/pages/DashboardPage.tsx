
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { SubscriptionAlertBanner } from "@/components/dashboard/SubscriptionAlertBanner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { session, authInitialized } = useAuth();
  const { currentPlan } = usePlan();
  const navigate = useNavigate();

  // Add debugging
  console.log("DashboardPage render - estado auth:", { 
    sessionExists: !!session, 
    authInitialized,
    currentPlan: currentPlan?.type
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

    // Verificação adicional de assinatura como fallback de segurança
    if (currentPlan.type === 'free') {
      console.log("Usuário sem assinatura ativa no DashboardPage, redirecionando para checkout");
      toast.error("Acesso restrito. Assinatura inativa.");
      navigate('/checkout', { 
        state: { 
          message: "Sua assinatura está inativa ou vencida. Renove seu plano para acessar a plataforma." 
        } 
      });
      return;
    }

    // Simulate loading time for components (simplified)
    const timer = setTimeout(() => {
      console.log("Conteúdo do dashboard carregado");
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [session, authInitialized, currentPlan, navigate]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 w-full">
          <SubscriptionAlertBanner />
          <DashboardTabs />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
