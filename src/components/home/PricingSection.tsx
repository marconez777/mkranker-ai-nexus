
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { PLANS } from "@/types/plans";

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
          {/* Solo Plan */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">{PLANS.solo.name}</h3>
            <p className="text-gray-600 mb-6">{PLANS.solo.description}</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ {PLANS.solo.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              {PLANS.solo.features.map((feature, index) => (
                <PlanFeature key={index} text={feature} />
              ))}
            </ul>
          </div>

          {/* Discovery Plan - highlighted */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col transform scale-105">
            <h3 className="text-2xl font-bold mb-4">{PLANS.discovery.name}</h3>
            <p className="text-gray-600 mb-6">{PLANS.discovery.description}</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ {PLANS.discovery.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              {PLANS.discovery.features.map((feature, index) => (
                <PlanFeature key={index} text={feature} />
              ))}
            </ul>
          </div>

          {/* Escala Plan */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">{PLANS.escala.name}</h3>
            <p className="text-gray-600 mb-6">{PLANS.escala.description}</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ {PLANS.escala.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              {PLANS.escala.features.map((feature, index) => (
                <PlanFeature key={index} text={feature} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
