
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // Verificar se o usuário já está autenticado e redirecioná-lo apropriadamente
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Se não há usuário, apenas remove o estado de carregamento
        if (!user) {
          setChecking(false);
          return;
        }
        
        console.log("Usuário já autenticado, redirecionando...");
        
        // Se há usuário, redirecione para o /admin
        // A página AdminPage fará a verificação de admin
        navigate('/admin');
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        setChecking(false);
      }
    };
    
    // Adiciona um pequeno delay para evitar problemas de timing
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-mkranker-purple">MKRanker</h1>
        <p className="text-gray-600">Painel Administrativo</p>
      </div>
      <AdminLoginForm />
    </div>
  );
};

export default AdminLoginPage;
