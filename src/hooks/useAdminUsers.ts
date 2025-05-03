
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
      console.log("Iniciando busca de usuários via função edge get-admin-users");
      setLoading(true);
      
      // Chamar a função edge get-admin-users para obter todos os usuários
      const { data, error } = await supabase.functions.invoke('get-admin-users');
      
      if (error) {
        throw error;
      }
      
      console.log("Dados de usuários recebidos:", data);
      
      if (data && data.users) {
        setUsers(data.users);
      } else {
        console.error("Formato de dados inválido:", data);
        toast.error("Formato de resposta inválido");
      }
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast.error(`Erro ao buscar usuários: ${error.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, fetchUsers };
};
