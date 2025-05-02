
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserUsageData {
  mercado_publico_alvo: number;
  palavras_chaves: number;
  funil_busca: number;
  texto_seo_blog: number;
  texto_seo_lp: number;
  texto_seo_produto: number;
  meta_dados: number;
  pautas_blog: number;
}

export interface DashboardStats {
  totalAnalyses: number;
  totalSeoTexts: number;
  totalKeywords: number;
  topTools: { name: string; percentage: number }[];
}

export interface RecentActivity {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}

export const useUserDashboardData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [usageData, setUsageData] = useState<UserUsageData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  // Function to fetch user usage data
  const fetchUserUsageData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user usage data:", error);
        return;
      }
      
      setUsageData(data as UserUsageData);
      
      // Calculate derived stats
      if (data) {
        const totalAnalyses = 
          (data.mercado_publico_alvo || 0) + 
          (data.palavras_chaves || 0) + 
          (data.funil_busca || 0) + 
          (data.texto_seo_blog || 0) + 
          (data.texto_seo_lp || 0) + 
          (data.texto_seo_produto || 0) + 
          (data.meta_dados || 0) + 
          (data.pautas_blog || 0);
          
        const totalSeoTexts = 
          (data.texto_seo_blog || 0) + 
          (data.texto_seo_lp || 0) + 
          (data.texto_seo_produto || 0);
          
        const totalKeywords = data.palavras_chaves || 0;
        
        // Calculate tool usage percentages
        const toolsData = [
          { key: "mercado_publico_alvo", name: "Mercado e Público Alvo", value: data.mercado_publico_alvo || 0 },
          { key: "palavras_chaves", name: "Palavras Chaves", value: data.palavras_chaves || 0 },
          { key: "funil_busca", name: "Funil de Busca", value: data.funil_busca || 0 },
          { key: "texto_seo_blog", name: "Texto SEO para Blog", value: data.texto_seo_blog || 0 },
          { key: "texto_seo_lp", name: "Texto SEO para LP", value: data.texto_seo_lp || 0 },
          { key: "texto_seo_produto", name: "Texto SEO para Produto", value: data.texto_seo_produto || 0 },
          { key: "meta_dados", name: "Meta Dados", value: data.meta_dados || 0 },
          { key: "pautas_blog", name: "Pautas de Blog", value: data.pautas_blog || 0 },
        ];
        
        // Calculate total for percentage calculation
        const totalUsage = toolsData.reduce((sum, tool) => sum + tool.value, 0);
        
        // Calculate percentages and sort by usage
        const topTools = toolsData
          .map(tool => ({
            name: tool.name,
            percentage: totalUsage > 0 ? Math.round((tool.value / totalUsage) * 100) : 0
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 4); // Get top 4 tools
        
        setStats({
          totalAnalyses,
          totalSeoTexts,
          totalKeywords,
          topTools,
        });
      }
    } catch (error) {
      console.error("Error in fetchUserUsageData:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch recent activity
  const fetchRecentActivity = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch the most recent activities from specific tables
      const fetchActivityFromTable = async (
        tableName: "analise_mercado" | "texto_seo_blog" | "texto_seo_produto" | "palavras_chaves_analises" | "analise_funil_busca",
        titleField: string,
        category: string
      ) => {
        const { data, error } = await supabase
          .from(tableName)
          .select(`id, ${titleField}, created_at`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) {
          console.error(`Error fetching from ${tableName}:`, error);
          return [];
        }
        
        return data.map(item => ({
          id: item.id,
          title: item[titleField] || `${category} sem título`,
          category,
          createdAt: item.created_at,
        }));
      };
      
      const [
        mercadoData,
        textoSeoBlogData,
        textoSeoProdutoData,
        palavrasChaveData,
        funilBuscaData
      ] = await Promise.all([
        fetchActivityFromTable("analise_mercado", "nicho", "Marketing Digital"),
        fetchActivityFromTable("texto_seo_blog", "tema", "Texto SEO Blog"),
        fetchActivityFromTable("texto_seo_produto", "nome_produto", "Texto SEO Produto"),
        fetchActivityFromTable("palavras_chaves_analises", "palavras_chave", "Palavras-Chave"),
        fetchActivityFromTable("analise_funil_busca", "segmento", "Funil de Busca")
      ]);
      
      // Combine all activities, sort by date, and take the 5 most recent
      const allActivities = [
        ...mercadoData,
        ...textoSeoBlogData,
        ...textoSeoProdutoData,
        ...palavrasChaveData,
        ...funilBuscaData
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
        
      setRecentActivity(allActivities);
    } catch (error) {
      console.error("Error in fetchRecentActivity:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserUsageData();
      fetchRecentActivity();
    }
  }, [user?.id]);

  return {
    isLoading,
    usageData,
    stats,
    recentActivity,
    refreshData: () => {
      fetchUserUsageData();
      fetchRecentActivity();
    }
  };
};
