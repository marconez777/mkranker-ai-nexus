
// Move the type definitions here to avoid circular imports
export type PlanType = 'free' | 'solo' | 'discovery' | 'escala';

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
  price: number;
  description: string;
  features: string[];
  limits: PlanLimits;
}

const FREE_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: 1,
  palavrasChaves: 1,
  funilBusca: 1,
  metaDados: 1,
  textoSeoBlog: 1,
  textoSeoLp: 1,
  textoSeoProduto: 1,
  pautasBlog: 1,
};

const SOLO_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: 5,
  palavrasChaves: 5,
  funilBusca: 5,
  metaDados: 5,
  textoSeoBlog: 5,
  textoSeoLp: 5,
  textoSeoProduto: 5,
  pautasBlog: 5,
};

const DISCOVERY_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: 15,
  palavrasChaves: 15,
  funilBusca: 15,
  metaDados: 15,
  textoSeoBlog: 15,
  textoSeoLp: 15,
  textoSeoProduto: 15,
  pautasBlog: 15,
};

const ESCALA_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: Infinity,
  palavrasChaves: Infinity,
  funilBusca: Infinity,
  metaDados: Infinity,
  textoSeoBlog: Infinity,
  textoSeoLp: Infinity,
  textoSeoProduto: Infinity,
  pautasBlog: Infinity,
};

export const PLANS: Record<PlanType, Plan> = {
  free: {
    type: 'free',
    name: 'Grátis',
    price: 0,
    description: 'Para experimentar nossa ferramenta',
    features: [
      'Acesso a todas funcionalidades',
      'Limite de 1 uso por ferramenta',
      'Sem suporte personalizado',
      'Sem mentoria'
    ],
    limits: FREE_LIMITS
  },
  solo: {
    type: 'solo',
    name: 'Solo',
    price: 39,
    description: 'Para profissionais autônomos',
    features: [
      '5 usos de cada ferramenta',
      'Suporte por email',
      'Acesso à comunidade',
      'Mentoria mensal (1 sessão)',
    ],
    limits: SOLO_LIMITS
  },
  discovery: {
    type: 'discovery',
    name: 'Discovery',
    price: 97,
    description: 'Para empresas em crescimento',
    features: [
      '15 usos de cada ferramenta',
      'Suporte prioritário',
      'Acesso à comunidade exclusiva',
      'Mentoria mensal (2 sessões)',
    ],
    limits: DISCOVERY_LIMITS
  },
  escala: {
    type: 'escala',
    name: 'Escala',
    price: 197,
    description: 'Para agências e equipes maiores',
    features: [
      'Usos ilimitados de todas as ferramentas',
      'Suporte VIP (resposta em até 2h)',
      'Acesso a conteúdos exclusivos',
      'Mentoria mensal (4 sessões)',
      'Análises de mercado ilimitadas',
      'Relatórios personalizados',
      'Integração com ferramentas externas'
    ],
    limits: ESCALA_LIMITS
  }
};
