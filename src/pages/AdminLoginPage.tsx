
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
        // Se há usuário, redirecione para o /admin
        // A página AdminPage fará a verificação de admin
        if (user) {
          console.log("Usuário já autenticado, redirecionando...");
          navigate('/admin');
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
      } finally {
        // Garante que o estado de checking será atualizado mesmo em caso de erro
        setChecking(false);
      }
    };
    
    // Usa setTimeout para evitar problemas de timing durante a inicialização
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 500);
    
    // Se não houver usuário após o timeout, apenas remove o estado de carregamento
    const fallbackTimer = setTimeout(() => {
      if (checking) {
        console.log("Fallback: finalizando verificação de autenticação");
        setChecking(false);
      }
    }, 3000); // Timeout de segurança após 3 segundos
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [user, navigate, checking]);

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
