
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
  mercadoPublicoAlvo: 3,
  palavrasChaves: 3,
  funilBusca: 3,
  metaDados: 3,
  textoSeoBlog: 3,
  textoSeoLp: 3,
  textoSeoProduto: 3,
  pautasBlog: 3,
};

const SOLO_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: 5,
  palavrasChaves: 5, // Updated as per request
  funilBusca: 5, // Updated as per request
  metaDados: 50,
  textoSeoBlog: 15, // Combined textos limit
  textoSeoLp: 15, // Combined textos limit
  textoSeoProduto: 15, // Combined textos limit
  pautasBlog: 5,
};

const DISCOVERY_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: 15,
  palavrasChaves: 60, // Updated as per request
  funilBusca: 15, // Updated as per request
  metaDados: 100,
  textoSeoBlog: 60, // Combined textos limit
  textoSeoLp: 60, // Combined textos limit
  textoSeoProduto: 60, // Combined textos limit
  pautasBlog: 15,
};

const ESCALA_LIMITS: PlanLimits = {
  mercadoPublicoAlvo: Infinity,
  palavrasChaves: Infinity, // Updated as per request
  funilBusca: Infinity, // Updated as per request
  metaDados: Infinity,
  textoSeoBlog: Infinity, // Combined textos limit
  textoSeoLp: Infinity, // Combined textos limit
  textoSeoProduto: Infinity, // Combined textos limit
  pautasBlog: Infinity,
};

export const PLANS: Record<PlanType, Plan> = {
  free: {
    type: 'free',
    name: 'Free',
    price: 0,
    description: 'Para experimentar nossa ferramenta',
    features: [
      'Acesso a todas funcionalidades',
      'Limite de 3 usos por ferramenta',
      'Sem suporte personalizado',
      'Sem mentoria'
    ],
    limits: FREE_LIMITS
  },
  solo: {
    type: 'solo',
    name: 'Solo',
    price: 97,
    description: 'Para profissionais autônomos',
    features: [
      '5 Pesquisas de Mercado',
      '5 Funis de Busca',
      '20 Pesquisas de Palavras Chave',
      '15 Textos Otimizados SEO',
      '5 Pesquisas de Pautas',
      '50 Gerações de Meta Dados',
      'Treinamentos Gravados',
      'Aulas Ao Vivo',
      'Mentoria em grupo (1 por mês)'
    ],
    limits: SOLO_LIMITS
  },
  discovery: {
    type: 'discovery',
    name: 'Discovery',
    price: 297,
    description: 'Para empresas em crescimento',
    features: [
      '15 Pesquisas de Mercado',
      '15 Funis de Busca',
      '60 Pesquisas de Palavras Chave',
      '60 Textos Otimizados SEO',
      '15 Pesquisas de Pautas',
      '100 Gerações de Meta Dados',
      'Treinamentos Gravados',
      'Aulas Ao Vivo',
      'Mentoria Individual (1 por mês)'
    ],
    limits: DISCOVERY_LIMITS
  },
  escala: {
    type: 'escala',
    name: 'Escala',
    price: 997,
    description: 'Para agências e equipes maiores',
    features: [
      'Pesquisas de Mercado Ilimitadas',
      'Funis de Busca Ilimitados',
      'Palavras Chave Ilimitadas',
      'Textos Otimizados SEO Ilimitados',
      'Pesquisas de Pautas Ilimitadas',
      'Gerações de Meta Dados Ilimitadas',
      'Treinamentos Gravados',
      'Aulas Ao Vivo',
      'Mentoria Individual (2 por mês)'
    ],
    limits: ESCALA_LIMITS
  }
};
