
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const PlanFeature = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 text-gray-600">
    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
      <Check className="h-3 w-3 text-white" />
    </div>
    {text}
  </li>
);

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Escolha o Plano Ideal para Você
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Solo</h3>
            <p className="text-gray-600 mb-6">Tudo o que freelancers ou empreendedores precisam para automatizar a rotina.</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ 149<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              <PlanFeature text="5 Análises de Mercado" />
              <PlanFeature text="5 Mapeamentos de Funis" />
              <PlanFeature text="15 Textos SEO Otimizados" />
              <PlanFeature text="15 Meta Dados" />
              <PlanFeature text="20 Pautas para Blog" />
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col transform scale-105">
            <h3 className="text-2xl font-bold mb-4">Discovery</h3>
            <p className="text-gray-600 mb-6">Perfeito para Empresas ou Agencias que querem escalar o SEO de forma mais agressiva.</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ 399<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              <PlanFeature text="15 Análises de Mercado" />
              <PlanFeature text="15 Mapeamentos de Funis" />
              <PlanFeature text="30 Textos SEO Otimizados" />
              <PlanFeature text="30 Meta Dados" />
              <PlanFeature text="100 Pautas para Blog" />
              <PlanFeature text="Treinamentos e Aulas Ao Vivo" />
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Escala</h3>
            <p className="text-gray-600 mb-6">Para você quer realmente dominar o mercado e tomar distancia dos seus concorrentes</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ 1299<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              <PlanFeature text="15 Análises de Mercado" />
              <PlanFeature text="15 Mapeamentos de Funis" />
              <PlanFeature text="Textos SEO Otimizados Ilimitados" />
              <PlanFeature text="Meta Dados Ilimitados" />
              <PlanFeature text="Pautas para Blog Ilimitadas" />
              <PlanFeature text="Treinamentos e Aulas Ao Vivo" />
              <PlanFeature text="3 Encontros de mentoria /mês" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
