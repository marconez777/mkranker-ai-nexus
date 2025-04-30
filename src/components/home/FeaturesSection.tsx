
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  UserSearch, 
  FileText, 
  ChevronRight,
  BarChart,
  FileQuestion 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <UserSearch className="h-10 w-10 text-mkranker-purple" />,
      title: "Análise de Público-Alvo",
      description: "Descubra quem são seus potenciais clientes e como alcançá-los.",
      route: "/mercado-publico-alvo"
    },
    {
      icon: <Search className="h-10 w-10 text-mkranker-blue" />,
      title: "Palavras-Chave",
      description: "Encontre as melhores palavras-chave para seu nicho de mercado.",
      route: "/palavras-chaves"
    },
    {
      icon: <FileText className="h-10 w-10 text-mkranker-purple" />,
      title: "Texto SEO para Landing Pages",
      description: "Crie textos otimizados para suas páginas de conversão.",
      route: "/texto-seo-lp"
    },
    {
      icon: <BarChart className="h-10 w-10 text-mkranker-blue" />,
      title: "Funnel de Busca",
      description: "Otimize sua estratégia para cada fase do funil de vendas.",
      route: "/funil-de-busca"
    },
    {
      icon: <FileQuestion className="h-10 w-10 text-mkranker-purple" />,
      title: "Pautas para Blog",
      description: "Gere ideias de conteúdo que engajam seu público.",
      route: "/pautas-blog"
    }
  ];
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Ferramentas com I.A.</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma oferece ferramentas avançadas para otimizar seus resultados de marketing digital.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border border-gray-100 hover:border-mkranker-purple hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-mkranker-purple text-mkranker-purple hover:bg-mkranker-purple hover:text-white"
                  onClick={() => navigate(feature.route)}
                >
                  Acessar <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
