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

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar user_usage:", JSON.stringify(error, null, 2));
        throw error;
      }

      if (!data) {
        const { data: newData, error: insertError } = await supabase
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
          console.error("Erro ao criar user_usage:", JSON.stringify(insertError, null, 2));
          throw insertError;
        }

        return newData;
      }

      return data as UserUsageData;
    },
    enabled: !!userId && authInitialized
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
        { name: "analise_mercado", category: "Público
