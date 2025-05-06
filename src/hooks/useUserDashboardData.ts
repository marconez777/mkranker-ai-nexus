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
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar user_usage:", error);
        throw error;
      }

      if (!data) {
        // Tenta criar apenas se não existir
        const { data: created, error: insertError } = await supabase
          .from("user_usage")
          .insert({
            user_id: userId,
            mercado_publico_alvo: 0,
            palavras_chaves: 0,
            funil_busca: 0,
            meta_dados: 0,
            texto_seo_blog: 0,
            texto_seo_lp: 0,
            texto_seo_produto: 0,
            pautas_blog: 0
          })
          .select()
          .single();

        if (insertError) {
          console.error("Erro ao criar registro user_usage:", insertError);
          throw insertError;
        }

        return created;
      }

      return data;
    },
    enabled: !!userId && authInitialized,
  });

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError
  } = useQuery({
    queryKey: ["recentActivities", userId],
    queryFn: async () => {
      if (!userId) return [];

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
            .from(table.name as any)
            .select("id, created_at, titulo, palavra_chave, segmento")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5);

          if (error) {
            console.error(`Erro buscando dados em ${table.name}:`, error);
            continue;
          }

          if (data?.length) {
            const activities = data.map((item: any) => ({
              id: typeof item.id === "string" ? item.id : `${table.name}-${Date.now()}`,
              title: item.titulo || item.palavra_chave || item.segmento || table.category,
              category: table.category,
              date: item.created_at || new Date().toISOString(),
              icon: table.icon,
            }));

            allActivities.push(...activities);
          }
        } catch (err) {
          console.error(`Erro ao buscar de ${table.name}:`, err);
        }
      }

      return allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    },
    enabled: !!userId && authInitialized,
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

    const totalAnalyses = (usageData.mercado_publico_alvo || 0) +
      (usageData.palavras_chaves || 0) +
      (usageData.funil_busca || 0) +
      (usageData.meta_dados || 0) +
      (usageData.texto_seo_blog || 0) +
      (usageData.texto_seo_lp || 0) +
      (usageData.texto_seo_produto || 0) +
      (usageData.pautas_blog || 0);

    const seoTexts = (usageData.texto_seo_blog || 0) +
      (usageData.texto_seo_lp || 0) +
      (usageData.texto_seo_produto || 0);

    const keywordsSearched = usageData.palavras_chaves || 0;

    const toolsMapping: Record<string, [string, number | undefined]> = {
      mercado_publico_alvo: ["Público Alvo", usageData.m
