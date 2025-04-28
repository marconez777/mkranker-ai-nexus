
import { Plan, PlanLimits, PlanType } from "@/types/plans";

export interface PlanContextType {
  currentPlan: Plan;
  getRemainingUses: (feature: keyof PlanLimits) => number;
  incrementUsage: (feature: keyof PlanLimits) => Promise<boolean>;
  resetUsage: () => Promise<boolean>;
  usageCounts: Record<keyof PlanLimits, number>;
  refreshPlan: () => Promise<void>;
  isLoading: boolean;
}

export interface UsageData {
  mercado_publico_alvo: number;
  palavras_chaves: number;
  funil_busca: number;
  meta_dados: number;
  texto_seo_blog: number;
  texto_seo_lp: number;
  texto_seo_produto: number;
  pautas_blog: number;
}

export const DEFAULT_USAGE: Record<keyof PlanLimits, number> = {
  mercadoPublicoAlvo: 0,
  palavrasChaves: 0,
  funilBusca: 0,
  metaDados: 0,
  textoSeoBlog: 0,
  textoSeoLp: 0,
  textoSeoProduto: 0,
  pautasBlog: 0
};
