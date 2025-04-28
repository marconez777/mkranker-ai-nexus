
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminLoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, check if they are an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data: isAdmin } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (isAdmin) {
            navigate('/admin');
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };
    
    checkAdminStatus();
  }, [user, navigate]);

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
