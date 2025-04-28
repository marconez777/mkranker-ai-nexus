
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminLoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Se o usuário já estiver autenticado e for um administrador, redirecione para a página de administração
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data: isAdmin } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          // Redirecionar apenas se confirmado que é um administrador
          if (isAdmin) {
            navigate('/admin');
          }
        } catch (error) {
          console.error("Erro ao verificar status de administrador:", error);
          // Não redirecionamos em caso de erro para permitir uma nova tentativa de login
        }
      }
    };
    
    checkAdminStatus();
  }, [user, navigate]);

  // Garante que a página é renderizada independentemente do status de autenticação
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
