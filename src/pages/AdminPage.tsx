
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsersTable } from "@/components/admin/UsersTable";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários e suas permissões no sistema
          </p>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <UsersTable users={users} onUpdate={fetchUsers} />
        )}
      </div>
    </DashboardLayout>
  );
}
