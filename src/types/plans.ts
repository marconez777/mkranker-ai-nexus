
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

export type PlanType = 'solo' | 'discovery' | 'escala';

export const PLANS: Record<PlanType, Plan> = {
  solo: {
    type: 'solo',
    name: 'Solo',
    description: 'Plano para profissionais individuais',
    price: 47,
    stripePriceId: 'price_1Oq3FgJEqMa964tpeV9G1EWB',
    limits: {
      mercadoPublicoAlvo: 5,
      palavrasChaves: 20,
      funilBusca: 5,
      metaDados: 50,
      textoSeoBlog: 15,
      textoSeoLp: 10,
      textoSeoProduto: 10,
      pautasBlog: 5
    }
  },
  discovery: {
    type: 'discovery',
    name: 'Discovery',
    description: 'Plano para pequenas empresas',
    price: 97,
    stripePriceId: 'price_1Oq3GJJEqMa964tpGnyw9v8R',
    limits: {
      mercadoPublicoAlvo: 15,
      palavrasChaves: 60,
      funilBusca: 15,
      metaDados: 100,
      textoSeoBlog: 60,
      textoSeoLp: 30,
      textoSeoProduto: 30,
      pautasBlog: 15
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
