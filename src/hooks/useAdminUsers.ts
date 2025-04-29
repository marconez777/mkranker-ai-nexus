
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '@/types/profile';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active?: boolean;
  full_name?: string;
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
      console.log("Iniciando busca de usuários");
      
      // Como auth.users não está diretamente acessível, usamos uma função edge
      // para buscar esses dados de usuário que precisamos
      const { data: usersData, error } = await supabase
        .functions.invoke('get-admin-users');

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
      }

      console.log("Dados de usuários recebidos:", usersData);
      
      // Buscar dados adicionais dos perfis e roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, is_active, created_at');
      
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("Dados de perfis recebidos:", profiles);

      // Buscar roles dos usuários
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) {
        console.error("Erro ao buscar roles:", rolesError);
        throw rolesError;
      }
      
      console.log("Dados de roles recebidos:", roles);

      // Buscar dados de uso
      const { data: usage, error: usageError } = await supabase
        .from('user_usage')
        .select('*');
      
      if (usageError) {
        console.error("Erro ao buscar dados de uso:", usageError);
        throw usageError;
      }
      
      console.log("Dados de uso recebidos:", usage);

      // Combinar todos os dados
      const combinedData = usersData.users.map((userData: any) => {
        // Encontrar o perfil correspondente
        const profile = profiles?.find((p: Profile) => p.id === userData.id);
        
        // Garantir que is_active é um booleano
        const isActive = profile?.is_active !== undefined ? profile.is_active : false;
        
        console.log(`Usuário ${userData.id} (${userData.email}): status ativo = ${isActive}`);
        
        // Encontrar o papel do usuário
        const userRole = roles?.find((r: any) => r.user_id === userData.id);
        const role = userRole ? userRole.role : 'user';
        
        // Encontrar dados de uso
        const userUsage = usage?.find((u: any) => u.user_id === userData.id);

        return {
          id: userData.id,
          email: userData.email,
          role: role,
          created_at: profile?.created_at || userData.created_at,
          is_active: isActive,
          full_name: profile?.full_name,
          usage: userUsage ? {
            palavras_chaves: userUsage.palavras_chaves || 0,
            mercado_publico_alvo: userUsage.mercado_publico_alvo || 0,
            funil_busca: userUsage.funil_busca || 0,
            texto_seo_blog: userUsage.texto_seo_blog || 0,
            texto_seo_lp: userUsage.texto_seo_lp || 0,
            texto_seo_produto: userUsage.texto_seo_produto || 0,
            pautas_blog: userUsage.pautas_blog || 0,
            meta_dados: userUsage.meta_dados || 0
          } : undefined
        };
      });

      console.log("Dados combinados:", combinedData);
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
