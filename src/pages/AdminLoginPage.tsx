
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const { user, isUserAdmin } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // Verificar se o usuário já está autenticado e se é admin antes de redirecioná-lo
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Se não há usuário, mantém na página de login
        if (!user) {
          console.log("Nenhum usuário autenticado, mantendo na página de login admin");
          setChecking(false);
          return;
        }
        
        console.log("Usuário autenticado, verificando se é admin:", user.id);
        
        // Verifica se o usuário é admin antes de redirecionar
        const adminStatus = await isUserAdmin(user.id);
        
        if (adminStatus) {
          console.log("Usuário é admin, redirecionando para /admin");
          navigate('/admin');
        } else {
          console.log("Usuário não é admin, mantendo na página de login");
          // Opcional: mostrar mensagem informando que precisa ser admin
          toast.error("Acesso restrito: apenas administradores podem entrar");
          setChecking(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        setChecking(false);
      } finally {
        // Garante que o estado de checking será atualizado mesmo em caso de erro
        setChecking(false);
      }
    };
    
    // Usa setTimeout para evitar problemas de timing durante a inicialização
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 500);
    
    // Fallback timer para garantir que a tela de loading não fique presa
    const fallbackTimer = setTimeout(() => {
      if (checking) {
        console.log("Fallback: finalizando verificação de autenticação");
        setChecking(false);
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [user, navigate, isUserAdmin, checking]);

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
