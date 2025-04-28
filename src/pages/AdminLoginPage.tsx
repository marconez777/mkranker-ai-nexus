
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
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        // Se não há usuário, mantém na página de login
        if (!user) {
          console.log("Nenhum usuário autenticado, mantendo na página de login admin");
          if (isMounted) setChecking(false);
          return;
        }
        
        console.log("Usuário autenticado, verificando se é admin:", user.id);
        
        // Verificar admin com timeout
        try {
          const adminStatus = await Promise.race([
            isUserAdmin(user.id),
            new Promise<boolean>((resolve) => {
              setTimeout(() => {
                console.log("Timeout na verificação de admin");
                resolve(false);
              }, 3000);
            })
          ]);
          
          if (adminStatus) {
            console.log("Usuário é admin, redirecionando para /admin");
            navigate('/admin');
          } else {
            console.log("Usuário não é admin, mantendo na página de login");
            if (isMounted) {
              toast.error("Acesso restrito: apenas administradores podem entrar");
              setChecking(false);
            }
          }
        } catch (error) {
          console.error("Erro ao verificar status de administrador:", error);
          if (isMounted) {
            toast.error("Erro ao verificar permissões de administrador");
            setChecking(false);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        if (isMounted) setChecking(false);
      } finally {
        if (isMounted) setChecking(false);
      }
    };
    
    // Curto delay para garantir que os estados de autenticação estão atualizados
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 300);
    
    // Fallback timer para garantir que a tela de loading não fique presa
    const fallbackTimer = setTimeout(() => {
      if (isMounted && checking) {
        console.log("Fallback: finalizando verificação de autenticação");
        setChecking(false);
      }
    }, 2000); // Reduzido para 2 segundos
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [user, navigate, isUserAdmin]);

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
