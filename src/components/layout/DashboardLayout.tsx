
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { session, loading, authInitialized } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Debug logging
  console.log("DashboardLayout render state:", { 
    session: !!session, 
    loading, 
    authInitialized,
    isRedirecting
  });

  useEffect(() => {
    // Set a timeout to show a message if loading takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Loading is taking longer than expected");
        setLoadingTimeout(true);
      }
    }, 5000);

    // Only check for session after auth system is initialized
    if (authInitialized) {
      console.log("Auth initialized, checking session:", !!session);
      
      // If not loading and no session, redirect to login
      if (!loading && !session) {
        console.log("User not authenticated, redirecting to login");
        setIsRedirecting(true);
        
        navigate('/login');
      }
    } else {
      console.log("Auth not yet initialized, waiting...");
    }

    return () => clearTimeout(timeoutId);
  }, [navigate, session, loading, authInitialized]);

  // Show loading screen while checking authentication
  if (loading || isRedirecting || !authInitialized) {
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
              Se isso persistir, tente atualizar a página ou verificar sua conexão com a internet.
            </p>
          )}
        </div>
      </div>
    );
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
