
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Verificar se o usuário atual é admin
      const { data: isAdmin, error: adminCheckError } = await supabase
        .rpc('is_admin', { user_id: user?.id });
      
      if (adminCheckError) throw adminCheckError;
      
      if (!isAdmin) {
        navigate('/dashboard');
        return;
      }

      // Buscar todos os usuários com seus papéis
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          auth.users!inner (
            email,
            created_at
          )
        `);

      if (error) throw error;

      const formattedUsers = data.map((item: any) => ({
        id: item.user_id,
        email: item.users.email,
        role: item.role,
        created_at: item.users.created_at
      }));

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  return { users, loading, fetchUsers };
}
