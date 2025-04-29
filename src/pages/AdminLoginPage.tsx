
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
  
  // Tempo de timeout aumentado para garantir verificação completa (ms)
  const INITIAL_CHECK_TIMEOUT = 5000;

  // Verificar se o usuário já está autenticado e é admin antes de redirecionar
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAuthStatus = async () => {
      try {
        // Definir um timeout razoável para verificação inicial
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("Timeout na verificação inicial de autenticação");
            setChecking(false);
          }
        }, INITIAL_CHECK_TIMEOUT);
        
        // Se não houver usuário, permanecer na página de login
        if (!user) {
          console.log("Nenhum usuário autenticado, mantendo na página de login admin");
          if (isMounted) setChecking(false);
          clearTimeout(timeoutId);
          return;
        }
        
        console.log("Usuário autenticado, verificando se é admin:", user.id);
        
        // Verificação de status de admin com timeout separado para evitar bloqueios
        const adminCheckPromise = isUserAdmin(user.id);
        
        // Garantir que a promise resolva em um tempo razoável
        const adminStatus = await Promise.race([
          adminCheckPromise,
          new Promise<boolean>((resolve) => {
            setTimeout(() => {
              console.log("Timeout na verificação de admin");
              resolve(false);
            }, 3000);
          })
        ]);
        
        console.log("Status de admin verificado:", adminStatus);
        
        if (adminStatus) {
          console.log("Usuário é admin, redirecionando para /admin");
          if (isMounted) navigate('/admin');
        } else {
          console.log("Usuário não é admin, mantendo na página de login");
          if (isMounted) {
            toast.error("Acesso restrito: apenas administradores podem entrar");
            setChecking(false);
          }
        }
        
        clearTimeout(timeoutId);
      } catch (error) {
        console.error("Erro ao verificar status de administrador:", error);
        if (isMounted) {
          toast.error("Erro ao verificar permissões de administrador");
          setChecking(false);
        }
        clearTimeout(timeoutId);
      }
    };
    
    checkAuthStatus();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
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
