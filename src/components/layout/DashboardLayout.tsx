
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [navigate, session, loading]);

  if (loading) {
    return <div>Carregando...</div>;
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
