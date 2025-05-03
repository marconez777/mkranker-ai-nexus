
import { Search, FileText, Target, KeySquare, FileCheck, ShoppingBag, BookOpen, Tags } from "lucide-react";
import SectionHeader from "./SectionHeader";

const features = [
  {
    icon: Target,
    title: "Mercado e Público Alvo",
    description: "Entenda seu mercado e público-alvo com análises detalhadas geradas por IA."
  },
  {
    icon: Search,
    title: "Mapeamento do Funil",
    description: "Receba uma lista de palavras do topo, meio e fundo de funil do seu nicho."
  },
  {
    icon: KeySquare,
    title: "Palavras Chaves",
    description: "Receba uma lista com as palavras-chave relacionadas e com a semântica correta."
  },
  {
    icon: FileText,
    title: "Texto SEO para LP",
    description: "Gere textos otimizados para suas páginas de vendas com foco em conversão."
  },
  {
    icon: ShoppingBag,
    title: "Texto SEO para E-commerce",
    description: "Gere textos otimizados para produtos e categorias da sua loja."
  },
  {
    icon: FileCheck,
    title: "Texto SEO para Blog",
    description: "Gere textos humanizados de altíssimo valor, otimizados para palavras chaves."
  },
  {
    icon: Tags,
    title: "Meta Dados",
    description: "Gere títulos e descrições persuasivas para todas as páginas do seu site."
  },
  {
    icon: BookOpen,
    title: "Pautas para Blog",
    description: "Gere uma grade de pautas com os termos topo de funil de forma estratégica."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <SectionHeader 
          title="Tudo que você precisa para automatizar o seu SEO"
          variant="gradient"
          alignment="left"
        />
        
        <div className="grid md:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
