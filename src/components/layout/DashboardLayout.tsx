
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { session, authInitialized } = useAuth();
  const { isLoading: planLoading } = usePlan();
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Debug logging
  console.log("DashboardLayout render - estado auth:", { 
    sessionExists: !!session,
    authInitialized
  });

  useEffect(() => {
    // Definir um timeout para mostrar uma mensagem se o carregamento demorar muito
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000);

    // Limpar o timeout quando o componente é desmontado ou as dependências mudam
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Verificar se a autenticação foi inicializada
    if (!authInitialized) {
      console.log("Auth ainda não inicializada no DashboardLayout");
      return;
    }

    // Verificar se existe uma sessão
    if (!session) {
      console.log("Sem sessão ativa no DashboardLayout, redirecionando para login");
      navigate('/login');
      return;
    }

    // Verificar se o carregamento do plano foi concluído
    if (planLoading) {
      console.log("Plano ainda está sendo carregado");
      return;
    }

    // Se chegou aqui, auth inicializada, sessão existe
    console.log("DashboardLayout: auth inicializada, sessão existe");
    setLoading(false);
  }, [session, authInitialized, navigate, planLoading]);

  // Mostrar tela de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">
            {loadingTimeout 
              ? "Carregando... Isso está demorando mais que o esperado." 
              : "Carregando..."}
          </p>
        </div>
      </div>
    );
  }

  // Renderizar o dashboard apenas se houver uma sessão ativa
  return (
    <div className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <div className="flex flex-1 w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col w-full">
          <Header />
          <ErrorBoundary>
            <main className="flex-1 p-2 md:p-4 w-full">{children}</main>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
