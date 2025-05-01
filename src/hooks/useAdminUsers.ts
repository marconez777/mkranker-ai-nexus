
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
  subscription?: {
    status: 'ativo' | 'inativo' | 'vencido';
    vencimento: string;
  };
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      console.log("Iniciando busca de usuários do Supabase...");
      setLoading(true);
      
      // Como auth.users não está diretamente acessível, usamos uma função edge
      // para buscar esses dados de usuário que precisamos
      const { data: usersData, error } = await supabase
        .functions.invoke('get-admin-users');

      if (error) throw error;
      console.log("Dados de usuários recebidos da função edge:", usersData?.users?.length || 0, "usuários");

      // Buscar dados adicionais dos perfis e roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, is_active, created_at');
      
      if (profilesError) throw profilesError;
      console.log("Dados de perfis recebidos:", profiles?.length || 0, "perfis");

      // Buscar roles dos usuários
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      console.log("Dados de roles recebidos:", roles?.length || 0, "roles");

      // Buscar dados de uso
      const { data: usage, error: usageError } = await supabase
        .from('user_usage')
        .select('*');
      
      if (usageError) throw usageError;
      console.log("Dados de uso recebidos:", usage?.length || 0, "registros de uso");
      
      // Buscar dados de assinatura
      const { data: subscriptions, error: subscriptionError } = await supabase
        .from('user_subscription')
        .select('user_id, status, vencimento');
      
      if (subscriptionError) throw subscriptionError;
      console.log("Dados de assinaturas recebidos:", subscriptions?.length || 0, "assinaturas");

      // Combinar todos os dados
      const combinedData = usersData.users.map((userData: any) => {
        // Encontrar o perfil correspondente
        const profile = profiles?.find((p: Profile) => p.id === userData.id) || {
          id: userData.id,
          created_at: undefined,
          is_active: false,
          full_name: undefined
        } as Partial<Profile>;
        
        // Encontrar o papel do usuário
        const userRole = roles?.find((r: any) => r.user_id === userData.id);
        const role = userRole ? userRole.role : 'user';
        
        // Encontrar dados de uso
        const userUsage = usage?.find((u: any) => u.user_id === userData.id);
        
        // Encontrar dados de assinatura
        const userSubscription = subscriptions?.find((s: any) => s.user_id === userData.id);
        
        // Verificar se a assinatura está vencida
        let subscriptionStatus = userSubscription?.status;
        if (subscriptionStatus === 'ativo' && userSubscription?.vencimento) {
          const expiryDate = new Date(userSubscription.vencimento);
          const today = new Date();
          if (expiryDate < today) {
            subscriptionStatus = 'vencido';
          }
        }

        return {
          id: userData.id,
          email: userData.email,
          role: role,
          created_at: profile.created_at || userData.created_at,
          is_active: profile.is_active !== undefined ? profile.is_active : false,
          full_name: profile.full_name,
          usage: userUsage ? {
            palavras_chaves: userUsage.palavras_chaves || 0,
            mercado_publico_alvo: userUsage.mercado_publico_alvo || 0,
            funil_busca: userUsage.funil_busca || 0,
            texto_seo_blog: userUsage.texto_seo_blog || 0,
            texto_seo_lp: userUsage.texto_seo_lp || 0,
            texto_seo_produto: userUsage.texto_seo_produto || 0,
            pautas_blog: userUsage.pautas_blog || 0,
            meta_dados: userUsage.meta_dados || 0
          } : undefined,
          subscription: userSubscription ? {
            status: subscriptionStatus || 'inativo',
            vencimento: userSubscription.vencimento
          } : undefined
        };
      });

      console.log("Dados combinados processados:", combinedData.length, "usuários");
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
