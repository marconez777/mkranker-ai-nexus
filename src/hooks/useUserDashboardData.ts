
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

// Interface para os dados de uso do usuário
interface UserUsageData {
  func_name: string;
  count: number;
}

// Interface para cada entrada de atividade recente
interface RecentActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  icon: string;
}

// Interface para os dados completos do dashboard
export interface DashboardData {
  totalAnalyses: number;
  seoTexts: number;
  keywordsSearched: number;
  toolsUsage: {
    name: string;
    value: number;
    percentage: number;
  }[];
  recentActivities: RecentActivity[];
  isLoading: boolean;
  error: Error | null;
}

export const useUserDashboardData = (): DashboardData => {
  const { user } = useAuth();
  const userId = user?.id;

  // Buscar dados de uso do usuário
  const { data: usageData, isLoading: usageLoading, error: usageError } = useQuery({
    queryKey: ['userDashboardData', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_usage')
        .select('func_name, count')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserUsageData[];
    },
    enabled: !!userId,
  });

  // Buscar atividades recentes
  const { data: activitiesData, isLoading: activitiesLoading, error: activitiesError } = useQuery({
    queryKey: ['recentActivities', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Vamos buscar dados de várias tabelas e combinar
      const tables = [
        { name: 'analise_mercado', category: 'Público Alvo', icon: 'users' },
        { name: 'palavras_chaves', category: 'Palavras-chave', icon: 'search' },
        { name: 'analise_funil_busca', category: 'Funil de Busca', icon: 'filter' },
        { name: 'texto_seo_lp', category: 'SEO Landing Page', icon: 'file-text' },
        { name: 'texto_seo_produto', category: 'SEO Produto', icon: 'shopping-bag' },
        { name: 'texto_seo_blog', category: 'SEO Blog', icon: 'book-open' },
        { name: 'pautas_blog', category: 'Pautas Blog', icon: 'list' },
        { name: 'meta_dados', category: 'Meta Dados', icon: 'tag' },
      ];

      // Array para armazenar todas as atividades
      const allActivities: any[] = [];

      // Buscar dados de cada tabela
      for (const table of tables) {
        try {
          // Verificamos se a tabela existe antes de consultar
          const { data } = await supabase
            .from(table.name)
            .select('id, created_at, nome, titulo, segmento')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

          if (data && data.length > 0) {
            // Adicionamos os itens encontrados ao array de atividades
            const activities = data.map((item: any) => ({
              id: item.id || `${table.name}-${Date.now()}`,
              title: item.nome || item.titulo || item.segmento || `${table.category} #${item.id?.substring(0, 8)}`,
              category: table.category,
              date: item.created_at,
              icon: table.icon,
            }));
            allActivities.push(...activities);
          }
        } catch (error) {
          console.error(`Erro ao buscar dados da tabela ${table.name}:`, error);
          // Continuamos para a próxima tabela mesmo se houver erro
        }
      }

      // Ordenar por data (mais recentes primeiro) e limitar a 10 itens
      return allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    },
    enabled: !!userId,
  });

  // Processamento dos dados de uso para estatísticas
  const dashboardStats = useMemo(() => {
    if (!usageData) {
      return {
        totalAnalyses: 0,
        seoTexts: 0,
        keywordsSearched: 0,
        toolsUsage: [],
      };
    }

    // Total de todas as análises
    const totalAnalyses = usageData.reduce((sum, item) => sum + item.count, 0);

    // Total de textos SEO (soma de texto_seo_blog, texto_seo_lp, texto_seo_produto)
    const seoTexts = usageData
      .filter(item => ['texto_seo_blog', 'texto_seo_lp', 'texto_seo_produto'].includes(item.func_name))
      .reduce((sum, item) => sum + item.count, 0);

    // Total de palavras-chave pesquisadas
    const keywordsSearched = usageData
      .find(item => item.func_name === 'palavras_chaves')?.count || 0;

    // Processamento para o gráfico de uso de ferramentas
    const toolsMapping: Record<string, string> = {
      'mercado_publico': 'Público Alvo',
      'palavras_chaves': 'Palavras-chave',
      'texto_seo_blog': 'SEO Blog',
      'texto_seo_lp': 'SEO Landing Page',
      'texto_seo_produto': 'SEO Produto',
      'funil_busca': 'Funil de Busca',
      'meta_dados': 'Meta Dados',
      'pautas_blog': 'Pautas Blog',
    };

    const toolsUsage = usageData
      .filter(item => item.func_name in toolsMapping)
      .map(item => ({
        name: toolsMapping[item.func_name] || item.func_name,
        value: item.count,
        percentage: totalAnalyses > 0 ? (item.count / totalAnalyses) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalAnalyses,
      seoTexts,
      keywordsSearched,
      toolsUsage,
    };
  }, [usageData]);

  return {
    ...dashboardStats,
    recentActivities: activitiesData || [],
    isLoading: usageLoading || activitiesLoading,
    error: usageError || activitiesError,
  };
};
