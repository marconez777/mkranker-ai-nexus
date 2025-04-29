
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { session, authInitialized, loading } = useAuth();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  // Debug logging
  console.log("LoginPage render - estado auth:", { 
    sessionExists: !!session, 
    authInitialized, 
    loading,
    pageLoading
  });

  useEffect(() => {
    // Se a autenticação não estiver inicializada, mantenha o carregamento
    if (!authInitialized) {
      return;
    }

    // Se já houver uma sessão ativa, redirecione para o dashboard
    if (session) {
      console.log("Sessão ativa no LoginPage, redirecionando para dashboard");
      navigate('/dashboard');
      return;
    }

    // Se a autenticação estiver inicializada e não houver sessão, mostrar o formulário de login
    setPageLoading(false);
  }, [session, authInitialized, navigate]);

  if (pageLoading || loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-mkranker-purple">MKRanker</h1>
        <p className="text-gray-600">Plataforma de Marketing com IA</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
