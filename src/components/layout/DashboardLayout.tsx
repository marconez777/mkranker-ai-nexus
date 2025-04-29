
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { session, loading, authInitialized } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Debug logging
  console.log("DashboardLayout render - estado auth:", { 
    sessionExists: !!session, 
    loading, 
    authInitialized,
    redirecting
  });

  useEffect(() => {
    // Set a timeout to show a message if loading takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Carregamento está demorando mais que o esperado");
        setLoadingTimeout(true);
      }
    }, 5000);

    // Clear the timeout when the component is unmounted or dependencies change
    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    // Only check for session after auth system is initialized and not during a redirect
    if (authInitialized && !loading && !redirecting) {
      console.log("Auth inicializada e não carregando, verificando sessão:", !!session);
      
      // If no session, redirect to login
      if (!session) {
        console.log("Nenhuma sessão ativa, redirecionando para login");
        setRedirecting(true);
        navigate('/login');
      }
    }
  }, [navigate, session, loading, authInitialized, redirecting]);

  // Show loading screen while checking authentication
  if (loading || redirecting || !authInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">
            {loadingTimeout 
              ? "Carregando... Isso está demorando mais que o esperado." 
              : "Carregando..."}
          </p>
          {loadingTimeout && (
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Estado atual: {loading ? "carregando" : "não carregando"}, 
              Redirecionando: {redirecting ? "sim" : "não"}, 
              Auth inicializada: {authInitialized ? "sim" : "não"}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Only render the dashboard if there's an active session
  if (!session) {
    console.log("Nenhuma sessão ativa na fase de renderização, retornando vazio");
    return null;
  }

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
