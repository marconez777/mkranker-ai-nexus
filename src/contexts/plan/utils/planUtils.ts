
import { PlanType, Plan } from "@/types/plans";

/**
 * Determines the plan type from subscription data
 */
export const determinePlanFromSubscription = (subscription: any): PlanType => {
  const planName = subscription.plans?.name?.toLowerCase() || '';
  if (planName.includes('escala')) return 'escala';
  if (planName.includes('discovery')) return 'discovery';
  return 'solo'; // Default to solo as the basic plan
};

/**
 * Creates a plan with updated limits from database values
 */
export const buildPlanWithDbLimits = (basePlan: Plan, dbPlan: any): Plan => {
  if (!dbPlan) return basePlan;
  
  return {
    ...basePlan,
    limits: {
      ...basePlan.limits,
      mercadoPublicoAlvo: dbPlan.limite_mercado_publico ?? basePlan.limits.mercadoPublicoAlvo,
      palavrasChaves: dbPlan.limite_palavras_chave ?? basePlan.limits.palavrasChaves,
      funilBusca: dbPlan.limite_funil_busca ?? basePlan.limits.funilBusca,
      metaDados: dbPlan.limite_metadados ?? basePlan.limits.metaDados,
      textoSeoBlog: dbPlan.limite_textos_seo ?? basePlan.limits.textoSeoBlog,
      textoSeoLp: dbPlan.limite_textos_seo ?? basePlan.limits.textoSeoLp,
      textoSeoProduto: dbPlan.limite_textos_seo ?? basePlan.limits.textoSeoProduto,
      pautasBlog: dbPlan.limite_pautas ?? basePlan.limits.pautasBlog
    }
  };
};
