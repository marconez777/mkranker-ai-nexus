export interface PlanLimits {
  mercadoPublicoAlvo: number;
  palavrasChaves: number;
  funilBusca: number;
  metaDados: number;
  textoSeoBlog: number;
  textoSeoLp: number;
  textoSeoProduto: number;
  pautasBlog: number;
}

export interface Plan {
  type: PlanType;
  name: string;
  description: string;
  price: number;
  stripePriceId?: string;
  limits: PlanLimits;
}

export type PlanType = 'free' | 'solo' | 'discovery' | 'escala';

export const PLANS: Record<PlanType, Plan> = {
  free: {
    type: 'free',
    name: 'Free',
    description: 'Plano gratuito com funcionalidades básicas',
    price: 0,
    limits: {
      mercadoPublicoAlvo: 3,
      palavrasChaves: 3,
      funilBusca: 3,
      metaDados: 3,
      textoSeoBlog: 3,
      textoSeoLp: 3,
      textoSeoProduto: 3,
      pautasBlog: 3
    }
  },
  solo: {
    type: 'solo',
    name: 'Solo',
    description: 'Plano para profissionais individuais',
    price: 47,
    stripePriceId: 'price_1Oq3FgJEqMa964tpeV9G1EWB',
    limits: {
      mercadoPublicoAlvo: 20,
      palavrasChaves: 20,
      funilBusca: 20,
      metaDados: 20,
      textoSeoBlog: 20,
      textoSeoLp: 20,
      textoSeoProduto: 20,
      pautasBlog: 20
    }
  },
  discovery: {
    type: 'discovery',
    name: 'Discovery',
    description: 'Plano para pequenas empresas',
    price: 97,
    stripePriceId: 'price_1Oq3GJJEqMa964tpGnyw9v8R',
    limits: {
      mercadoPublicoAlvo: 60,
      palavrasChaves: 60,
      funilBusca: 60,
      metaDados: 60,
      textoSeoBlog: 60,
      textoSeoLp: 60,
      textoSeoProduto: 60,
      pautasBlog: 60
    }
  },
  escala: {
    type: 'escala',
    name: 'Escala',
    description: 'Plano para empresas em crescimento',
    price: 197,
    stripePriceId: 'price_1Oq3GqJEqMa964tpFtwrKjtl',
    limits: {
      mercadoPublicoAlvo: Infinity,
      palavrasChaves: Infinity,
      funilBusca: Infinity,
      metaDados: Infinity,
      textoSeoBlog: Infinity,
      textoSeoLp: Infinity,
      textoSeoProduto: Infinity,
      pautasBlog: Infinity
    }
  }
};
