
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

// Interface for user usage data structure in the database
interface UserUsageData {
  user_id: string;
  mercado_publico_alvo?: number;
  palavras_chaves?: number;
  funil_busca?: number;
  meta_dados?: number;
  texto_seo_blog?: number;
  texto_seo_lp?: number;
  texto_seo_produto?: number;
  pautas_blog?: number;
}

// Interface for each entry of recent activity
interface RecentActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  icon: string;
}

// Interface for tool usage statistics
interface ToolUsage {
  name: string;
  value: number;
  percentage: number;
}

// Interface for the complete dashboard data
export interface DashboardData {
  totalAnalyses: number;
  seoTexts: number;
  keywordsSearched: number;
  toolsUsage: ToolUsage[];
  recentActivities: RecentActivity[];
  isLoading: boolean;
  error: Error | null;
}

export const useUserDashboardData = (): DashboardData => {
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch user usage data
  const { data: usageData, isLoading: usageLoading, error: usageError } = useQuery({
    queryKey: ['userUsageData', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as UserUsageData;
    },
    enabled: !!userId,
  });

  // Fetch recent activities
  const { data: activitiesData, isLoading: activitiesLoading, error: activitiesError } = useQuery({
    queryKey: ['recentActivities', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Define tables to query for activity data
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

      // Array to store all activities
      const allActivities: RecentActivity[] = [];

      // Fetch data from each table
      for (const table of tables) {
        try {
          // Use type assertion to bypass TypeScript check for the table name
          const { data, error } = await supabase
            .from(table.name as any)
            .select('id, created_at, nome, titulo, segmento')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

          if (error) {
            console.error(`Error fetching data from table ${table.name}:`, error);
            continue;
          }

          if (data && data.length > 0) {
            // Add found items to activities array, with proper type checking
            const activities = data.map((item: any) => {
              // Ensure we have a valid ID or create one
              const id = typeof item.id === 'string' ? 
                item.id : 
                `${table.name}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
              
              // Ensure we have a valid title
              const title = item.nome || item.titulo || item.segmento || `${table.category} ${id.substring(0, 8)}`;
              
              // Ensure we have a valid date
              const date = item.created_at || new Date().toISOString();
              
              return {
                id,
                title,
                category: table.category,
                date,
                icon: table.icon,
              };
            });
            
            allActivities.push(...activities);
          }
        } catch (error) {
          console.error(`Error fetching data from table ${table.name}:`, error);
        }
      }

      // Sort by date (most recent first) and limit to 10 items
      return allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    },
    enabled: !!userId,
  });

  // Process usage data for statistics
  const dashboardStats = useMemo(() => {
    if (!usageData) {
      return {
        totalAnalyses: 0,
        seoTexts: 0,
        keywordsSearched: 0,
        toolsUsage: [],
      };
    }

    // Calculate total analyses
    const totalAnalyses = (usageData.mercado_publico_alvo || 0) +
      (usageData.palavras_chaves || 0) +
      (usageData.funil_busca || 0) +
      (usageData.meta_dados || 0) +
      (usageData.texto_seo_blog || 0) +
      (usageData.texto_seo_lp || 0) +
      (usageData.texto_seo_produto || 0) +
      (usageData.pautas_blog || 0);

    // Calculate total SEO texts
    const seoTexts = (usageData.texto_seo_blog || 0) +
      (usageData.texto_seo_lp || 0) +
      (usageData.texto_seo_produto || 0);

    // Get keywords searched
    const keywordsSearched = usageData.palavras_chaves || 0;

    // Process data for tools usage chart
    const toolsMapping: Record<string, [string, number | undefined]> = {
      'mercado_publico_alvo': ['Público Alvo', usageData.mercado_publico_alvo],
      'palavras_chaves': ['Palavras-chave', usageData.palavras_chaves],
      'texto_seo_blog': ['SEO Blog', usageData.texto_seo_blog],
      'texto_seo_lp': ['SEO Landing Page', usageData.texto_seo_lp],
      'texto_seo_produto': ['SEO Produto', usageData.texto_seo_produto],
      'funil_busca': ['Funil de Busca', usageData.funil_busca],
      'meta_dados': ['Meta Dados', usageData.meta_dados],
      'pautas_blog': ['Pautas Blog', usageData.pautas_blog],
    };

    const toolsUsage: ToolUsage[] = Object.entries(toolsMapping)
      .map(([key, [name, value]]) => ({
        name,
        value: value || 0,
        percentage: totalAnalyses > 0 ? ((value || 0) / totalAnalyses) * 100 : 0,
      }))
      .filter(tool => tool.value > 0)
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
