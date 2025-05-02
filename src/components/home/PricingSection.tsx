
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Users, Search, FileText, Database, BarChart, Award, Bookmark, Video, Users2 } from "lucide-react";
import { PLANS } from "@/types/plans";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PlanFeature = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 text-gray-600">
    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
      <Check className="h-3 w-3 text-white" />
    </div>
    {text}
  </li>
);

interface DbPlan {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  description?: string;
  limite_mercado_publico: number | null;
  limite_funil_busca: number | null;
  limite_palavras_chave: number | null;
  limite_textos_seo: number | null;
  limite_pautas: number | null;
  limite_metadados: number | null;
}

interface PlanFeatureProps {
  icon: React.ElementType;
  text: string;
  isHighlighted?: boolean;
}

const PlanFeatureItem = ({ icon: Icon, text, isHighlighted = false }: PlanFeatureProps) => (
  <li className={`flex items-center gap-2 ${isHighlighted ? 'text-mkranker-purple font-medium' : 'text-gray-600'} mb-2`}>
    <Icon size={16} className={isHighlighted ? 'text-mkranker-purple' : 'text-gray-500'} />
    <span>{text}</span>
  </li>
);

const PricingSection = () => {
  const navigate = useNavigate();
  const [dbPlans, setDbPlans] = useState<DbPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true);
          
        if (error) {
          console.error("Error fetching plans:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setDbPlans(data);
        }
      } catch (err) {
        console.error("Error in plans fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleSelectPlan = (planType: string) => {
    navigate("/checkout", { state: { selectedPlan: planType } });
  };

  return (
    <section id="planos" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Escolha o Plano Ideal para Você
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Escale seu marketing digital com nossos planos completos. Todos incluem acesso às melhores ferramentas de SEO com IA.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Solo Plan */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{PLANS.solo.name}</h3>
            <p className="text-gray-600 mb-4">{PLANS.solo.description}</p>
            <div className="text-3xl font-bold mb-4 flex items-end">
              R$ {PLANS.solo.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-6"
              onClick={() => handleSelectPlan('solo')}
            >
              Começar Agora
            </Button>
            
            <ul className="space-y-1 mt-2 flex-grow">
              <PlanFeatureItem icon={Users} text="5 Pesquisas de Mercado" />
              <PlanFeatureItem icon={BarChart} text="5 Funis de Busca" />
              <PlanFeatureItem icon={Search} text="20 Pesquisas de Palavras Chave" isHighlighted />
              <PlanFeatureItem icon={FileText} text="15 Textos Otimizados SEO" />
              <PlanFeatureItem icon={Bookmark} text="5 Pesquisas de Pautas" />
              <PlanFeatureItem icon={Database} text="50 Gerações de Meta Dados" isHighlighted />
              <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
              <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
              <PlanFeatureItem icon={Users2} text="Mentoria em grupo (1 por mês)" />
            </ul>
          </div>

          {/* Discovery Plan - highlighted */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-mkranker-purple flex flex-col transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white px-4 py-1 rounded-full text-sm font-medium">
              Mais Popular
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{PLANS.discovery.name}</h3>
            <p className="text-gray-600 mb-4">{PLANS.discovery.description}</p>
            <div className="text-3xl font-bold mb-4 flex items-end">
              R$ {PLANS.discovery.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-6"
              onClick={() => handleSelectPlan('discovery')}
            >
              Começar Agora
            </Button>
            
            <ul className="space-y-1 mt-2 flex-grow">
              <PlanFeatureItem icon={Users} text="15 Pesquisas de Mercado" />
              <PlanFeatureItem icon={BarChart} text="15 Funis de Busca" />
              <PlanFeatureItem icon={Search} text="60 Pesquisas de Palavras Chave" isHighlighted />
              <PlanFeatureItem icon={FileText} text="60 Textos Otimizados SEO" isHighlighted />
              <PlanFeatureItem icon={Bookmark} text="15 Pesquisas de Pautas" />
              <PlanFeatureItem icon={Database} text="100 Gerações de Meta Dados" isHighlighted />
              <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
              <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
              <PlanFeatureItem icon={Users2} text="Mentoria Individual (1 por mês)" isHighlighted />
            </ul>
          </div>

          {/* Escala Plan */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{PLANS.escala.name}</h3>
            <p className="text-gray-600 mb-4">{PLANS.escala.description}</p>
            <div className="text-3xl font-bold mb-4 flex items-end">
              R$ {PLANS.escala.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-6"
              onClick={() => handleSelectPlan('escala')}
            >
              Começar Agora
            </Button>
            
            <ul className="space-y-1 mt-2 flex-grow">
              <li className="flex items-center gap-2 text-mkranker-purple font-medium mb-4">
                <Award size={18} className="text-mkranker-purple" />
                <span className="font-semibold">Todas as ferramentas ilimitadas:</span>
              </li>
              <PlanFeatureItem icon={Users} text="Pesquisas de Mercado Ilimitadas" />
              <PlanFeatureItem icon={BarChart} text="Funis de Busca Ilimitados" />
              <PlanFeatureItem icon={Search} text="Palavras Chave Ilimitadas" isHighlighted />
              <PlanFeatureItem icon={FileText} text="Textos Otimizados SEO Ilimitados" isHighlighted />
              <PlanFeatureItem icon={Bookmark} text="Pesquisas de Pautas Ilimitadas" />
              <PlanFeatureItem icon={Database} text="Gerações de Meta Dados Ilimitadas" isHighlighted />
              <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
              <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
              <PlanFeatureItem icon={Users2} text="Mentoria Individual (2 por mês)" isHighlighted />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
