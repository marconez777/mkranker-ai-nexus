
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
    // Definir um timeout para mostrar uma mensagem se o carregamento demorar muito
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Carregamento está demorando mais que o esperado");
        setLoadingTimeout(true);
      }
    }, 5000);

    // Limpar o timeout quando o componente é desmontado ou as dependências mudam
    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    // Verificar a sessão apenas após o sistema de autenticação ser inicializado e não durante um redirecionamento
    if (authInitialized && !loading && !redirecting) {
      console.log("Auth inicializada e não carregando, verificando sessão:", !!session);
      
      // Se não houver sessão, redirecionar para login
      if (!session) {
        console.log("Nenhuma sessão ativa, redirecionando para login");
        setRedirecting(true);
        navigate('/login');
      }
    }
  }, [navigate, session, loading, authInitialized, redirecting]);

  // Mostrar tela de carregamento enquanto verifica a autenticação
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

  // Renderizar o dashboard apenas se houver uma sessão ativa
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
