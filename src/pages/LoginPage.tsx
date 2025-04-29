
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { session, authInitialized } = useAuth();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  console.log("LoginPage render - estado auth:", { 
    sessionExists: !!session, 
    authInitialized,
    pageLoading
  });

  useEffect(() => {
    // Caso a autenticação ainda não esteja inicializada, continuar carregando
    if (!authInitialized) {
      console.log("Auth não inicializada ainda, aguardando...");
      return;
    }

    // Se já houver uma sessão ativa após a inicialização, redirecionar
    if (session) {
      console.log("Sessão ativa detectada, redirecionando para dashboard");
      navigate('/dashboard');
      return;
    }

    // Autenticação inicializada e sem sessão, mostrar o formulário
    console.log("Auth inicializada e sem sessão, mostrando formulário");
    setPageLoading(false);
  }, [session, authInitialized, navigate]);

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (pageLoading) {
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
