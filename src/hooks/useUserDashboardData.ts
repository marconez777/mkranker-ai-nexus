import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

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

interface RecentActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  icon: string;
}

interface ToolUsage {
  name: string;
  value: number;
  percentage: number;
}

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
  const { user, authInitialized } = useAuth();
  const userId = user?.id;

  const {
    data: usageData,
    isLoading: usageLoading,
    error: usageError
  } = useQuery({
    queryKey: ["userUsageData", userId],
    enabled: !!userId && authInitialized,
    queryFn: async () => {
      if (!userId) return null;

      // Consulta sem maybeSingle, porque pode não existir ainda
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Erro ao buscar user_usage:", error);
        throw error;
      }

      let record = data?.[0];

      if (!record) {
        const { data: inserted, error: insertError } = await supabase
          .from("user_usage")
          .insert([{
            user_id: userId,
            mercado_publico_alvo: 0,
            palavras_chaves: 0,
            funil_busca: 0,
            meta_dados: 0,
            texto_seo_blog: 0,
            texto_seo_lp: 0,
            texto_seo_produto: 0,
            pautas_blog: 0
          }])
          .select()
          .single();

        if (insertError) {
          console.error("Erro ao criar registro user_usage:", insertError);
          throw insertError;
        }

        record = inserted;
      }

      return record as UserUsageData;
    }
  });

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError
  } = useQuery({
    queryKey: ["recentActivities", userId],
    enabled: !!userId && authInitialized,
    queryFn: async () => {
      const tables = [
        { name: "analise_mercado", category: "Público Alvo", icon: "users" },
        { name: "palavras_chaves", category: "Palavras-chave", icon: "search" },
        { name: "analise_funil_busca", category: "Funil de Busca", icon: "filter" },
        { name: "texto_seo_lp", category: "SEO Landing Page", icon: "file-text" },
        { name: "texto_seo_produto", category: "SEO Produto", icon: "shopping-bag" },
        { name: "texto_seo_blog", category: "SEO Blog", icon: "book-open" },
        { name: "pautas_blog", category: "Pautas Blog", icon: "list" },
        { name: "meta_dados", category: "Meta Dados", icon: "tag" },
      ];

      const allActivities: RecentActivity[] = [];

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table.name)
            .select("id, created_at, titulo, palavra_chave, segmento")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5);

          if (error) {
            console.error(`Erro buscando dados em ${table.name}:`, error);
            continue;
          }

          if (data?.length) {
            const mapped = data.map((item: any) => ({
              id: typeof item.id === "string" ? item.id : `${table.name}-${Date.now()}`,
              title: item.titulo || item.palavra_chave || item.segmento || table.category,
              category: table.category,
              date: item.created_at,
              icon: table.icon,
            }));
            allActivities.push(...mapped);
          }
        } catch (err) {
          console.error(`Erro ao buscar de ${table.name}:`, err);
        }
      }

      return allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    }
  });

  const dashboardStats = useMemo(() => {
    if (!usageData) {
      return {
        totalAnalyses: 0,
        seoTexts: 0,
        keywordsSearched: 0,
        toolsUsage: [],
      };
    }

    const totalAnalyses = Object.values(usageData)
      .filter(val => typeof val === "number")
      .reduce((sum, val) => sum + (val || 0), 0);

    const seoTexts = (usageData.texto_seo_blog || 0) +
      (usageData.texto_seo_lp || 0) +
      (usageData.texto_seo_produto || 0);

    const keywordsSearched = usageData.palavras_chaves || 0;

    const toolsMapping: Record<string, [string, number | undefined]> = {
      mercado_publico_alvo: ["Público Alvo", usageData.mercado_publico_alvo],
      palavras_chaves: ["Palavras-chave", usageData.palavras_chaves],
      texto_seo_blog: ["SEO Blog", usageData.texto_seo_blog],
      texto_seo_lp: ["SEO Landing Page", usageData.texto_seo_lp],
      texto_seo_produto: ["SEO Produto", usageData.texto_seo_produto],
      funil_busca: ["Funil de Busca", usageData.funil_busca],
      meta_dados: ["Meta Dados", usageData.meta_dados],
      pautas_blog: ["Pautas Blog", usageData.pautas_blog],
    };

    const toolsUsage: ToolUsage[] = Object.entries(toolsMapping)
      .map(([_, [name, value]]) => ({
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
