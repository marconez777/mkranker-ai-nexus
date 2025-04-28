
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
  usage?: {
    palavras_chaves: number;
    mercado_publico_alvo: number;
    funil_busca: number;
    texto_seo_blog: number;
    texto_seo_lp: number;
    texto_seo_produto: number;
    pautas_blog: number;
    meta_dados: number;
  };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isUserAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      // Verificar se o usuário atual é admin
      const isAdmin = await isUserAdmin(user.id);
      
      if (!isAdmin) {
        navigate('/dashboard');
        return;
      }

      // Buscar todos os usuários com seus papéis
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role
        `);

      if (userRolesError) throw userRolesError;

      // Buscar todos os perfis de usuário
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          is_active
        `);

      if (profilesError) throw profilesError;

      // Buscar estatísticas de uso
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select(`
          user_id,
          palavras_chaves,
          mercado_publico_alvo,
          funil_busca,
          texto_seo_blog,
          texto_seo_lp,
          texto_seo_produto,
          pautas_blog,
          meta_dados
        `);

      if (usageError) throw usageError;

      // Buscar informações dos usuários do auth.users
      const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers();

      if (error) throw error;

      // Mapear todos os dados juntos
      const formattedUsers = authUsers.map((authUser) => {
        const userRole = userRolesData?.find(ur => ur.user_id === authUser.id) || { role: 'user' };
        const profile = profilesData?.find(p => p.id === authUser.id) || { is_active: false };
        const usage = usageData?.find(u => u.user_id === authUser.id);

        return {
          id: authUser.id,
          email: authUser.email || 'No email',
          role: userRole.role as 'admin' | 'user',
          created_at: authUser.created_at,
          is_active: profile.is_active,
          usage: {
            palavras_chaves: usage?.palavras_chaves || 0,
            mercado_publico_alvo: usage?.mercado_publico_alvo || 0,
            funil_busca: usage?.funil_busca || 0,
            texto_seo_blog: usage?.texto_seo_blog || 0,
            texto_seo_lp: usage?.texto_seo_lp || 0,
            texto_seo_produto: usage?.texto_seo_produto || 0,
            pautas_blog: usage?.pautas_blog || 0,
            meta_dados: usage?.meta_dados || 0,
          }
        };
      });

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  return { users, loading, fetchUsers };
}
