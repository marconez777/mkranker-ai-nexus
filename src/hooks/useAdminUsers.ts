
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active?: boolean;
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

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Buscar os perfis de usuário com roles e usage
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id, 
          created_at, 
          is_active,
          user_roles!user_roles_user_id_fkey (role),
          user_usage (*)
        `)
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Como auth.users não está diretamente acessível, usamos uma função edge
      // para buscar esses dados de usuário que precisamos
      const { data: usersData, error } = await supabase
        .functions.invoke('get-admin-users');

      if (error) throw error;

      // Combinar todos os dados
      const combinedData = profiles.map((profile: any) => {
        // Encontrar os dados do usuário correspondente
        const userData = usersData.users.find((u: any) => u.id === profile.id);
        // Pegar o papel do primeiro resultado (assumindo que cada usuário tem apenas um papel)
        const role = profile.user_roles?.[0]?.role || 'user';
        // Encontrar dados de uso
        const usage = profile.user_usage?.[0];

        return {
          id: profile.id,
          email: userData?.email || 'Email não disponível',
          role: role,
          created_at: profile.created_at,
          is_active: profile.is_active,
          usage: usage ? {
            palavras_chaves: usage.palavras_chaves || 0,
            mercado_publico_alvo: usage.mercado_publico_alvo || 0,
            funil_busca: usage.funil_busca || 0,
            texto_seo_blog: usage.texto_seo_blog || 0,
            texto_seo_lp: usage.texto_seo_lp || 0,
            texto_seo_produto: usage.texto_seo_produto || 0,
            pautas_blog: usage.pautas_blog || 0,
            meta_dados: usage.meta_dados || 0
          } : undefined
        };
      });

      setUsers(combinedData);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast.error(`Erro ao buscar usuários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, fetchUsers };
};
