
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
  
  // Initial check timeout (ms)
  const INITIAL_CHECK_TIMEOUT = 3000;

  // Check if user is already authenticated and is admin before redirecting
  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        // Set a reasonable timeout for initial check
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("Timeout na verificação inicial de autenticação");
            setChecking(false);
          }
        }, INITIAL_CHECK_TIMEOUT);
        
        // If no user, stay on the login page
        if (!user) {
          console.log("Nenhum usuário autenticado, mantendo na página de login admin");
          if (isMounted) setChecking(false);
          clearTimeout(timeoutId);
          return;
        }
        
        console.log("Usuário autenticado, verificando se é admin:", user.id);
        
        // Simple check for admin status
        const adminStatus = await isUserAdmin(user.id);
        
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
      }
    };
    
    checkAuthStatus();
    
    return () => {
      isMounted = false;
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
