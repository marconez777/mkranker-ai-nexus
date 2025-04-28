
export type PlanType = 'solo' | 'discovery' | 'escala';

export interface PlanLimits {
  mercadoPublicoAlvo: number;
  funilBusca: number;
  palavrasChaves: number;
  textoSeoLp: number;
  textoSeoProduto: number;
  textoSeoBlog: number;
  pautasBlog: number;
  metaDados: number;
}

export interface Plan {
  type: PlanType;
  name: string;
  description: string;
  price: number;
  limits: PlanLimits;
  features: string[];
}

export const PLANS: Record<PlanType, Plan> = {
  solo: {
    type: 'solo',
    name: 'Solo',
    description: 'Tudo o que freelancers ou empreendedores precisam para automatizar a rotina.',
    price: 149,
    limits: {
      mercadoPublicoAlvo: 5,
      funilBusca: 5,
      palavrasChaves: 5,
      textoSeoLp: 15,
      textoSeoProduto: 15,
      textoSeoBlog: 15,
      pautasBlog: 1,
      metaDados: 15
    },
    features: [
      "5 Análises de Mercado",
      "5 Mapeamentos de Funis",
      "5 Análises de Palavras Chaves",
      "15 Textos SEO para LP",
      "15 Textos SEO para Produto",
      "15 Textos SEO para Blog",
      "1 Pauta para Blog",
      "15 Meta Dados"
    ]
  },
  discovery: {
    type: 'discovery',
    name: 'Discovery',
    description: 'Perfeito para Empresas ou Agencias que querem escalar o SEO de forma mais agressiva.',
    price: 399,
    limits: {
      mercadoPublicoAlvo: 15,
      funilBusca: 15,
      palavrasChaves: 15,
      textoSeoLp: 30,
      textoSeoProduto: 30,
      textoSeoBlog: 30,
      pautasBlog: 5,
      metaDados: 15
    },
    features: [
      "15 Análises de Mercado",
      "15 Mapeamentos de Funis",
      "15 Análises de Palavras Chaves",
      "30 Textos SEO para LP",
      "30 Textos SEO para Produto",
      "30 Textos SEO para Blog",
      "5 Pautas para Blog",
      "15 Meta Dados",
      "Treinamentos e Aulas Ao Vivo"
    ]
  },
  escala: {
    type: 'escala',
    name: 'Escala',
    description: 'Para você quer realmente dominar o mercado e tomar distancia dos seus concorrentes',
    price: 1299,
    limits: {
      mercadoPublicoAlvo: Infinity,
      funilBusca: Infinity,
      palavrasChaves: Infinity,
      textoSeoLp: Infinity,
      textoSeoProduto: Infinity,
      textoSeoBlog: Infinity,
      pautasBlog: Infinity,
      metaDados: Infinity
    },
    features: [
      "Análises de Mercado Ilimitadas",
      "Mapeamentos de Funis Ilimitados",
      "Análises de Palavras Chaves Ilimitadas",
      "Textos SEO para LP Ilimitados",
      "Textos SEO para Produto Ilimitados",
      "Textos SEO para Blog Ilimitados",
      "Pautas para Blog Ilimitadas",
      "Meta Dados Ilimitados",
      "Treinamentos e Aulas Ao Vivo",
      "3 Encontros de mentoria /mês"
    ]
  }
};
