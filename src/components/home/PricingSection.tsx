
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Users, Search, FileText, Database, BarChart, Award } from "lucide-react";
import { PLANS } from "@/types/plans";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

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

const PlanLimitItem = ({ 
  icon: Icon, 
  title, 
  limit, 
  isHighlighted = false 
}: { 
  icon: any, 
  title: string, 
  limit: number | null | undefined,
  isHighlighted?: boolean
}) => (
  <div className={`flex items-center gap-2 ${isHighlighted ? 'text-mkranker-purple font-medium' : 'text-gray-600'}`}>
    <Icon size={16} className={isHighlighted ? 'text-mkranker-purple' : 'text-gray-500'} />
    <span>{title}: </span>
    <span className="font-semibold">{limit === null || limit === Infinity ? 'Ilimitado' : limit}</span>
  </div>
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

  // Get DB plan by name or fallback to static plan
  const getPlanLimits = (planType: string) => {
    const matchedPlan = dbPlans.find(p => 
      p.name.toLowerCase().includes(planType.toLowerCase())
    );
    
    return matchedPlan;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
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
            
            {/* Limites do plano */}
            <Card className="mb-6 bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Limites mensais:</h4>
                <div className="space-y-2">
                  {dbPlans.length > 0 && (
                    <>
                      <PlanLimitItem 
                        icon={Users} 
                        title="Mercado e Público" 
                        limit={getPlanLimits('solo')?.limite_mercado_publico || PLANS.solo.limits.mercadoPublicoAlvo} 
                      />
                      <PlanLimitItem 
                        icon={Search} 
                        title="Palavras-chave" 
                        limit={getPlanLimits('solo')?.limite_palavras_chave || PLANS.solo.limits.palavrasChaves}
                        isHighlighted 
                      />
                      <PlanLimitItem 
                        icon={BarChart} 
                        title="Funil de Busca" 
                        limit={getPlanLimits('solo')?.limite_funil_busca || PLANS.solo.limits.funilBusca} 
                      />
                      <PlanLimitItem 
                        icon={FileText} 
                        title="Textos SEO" 
                        limit={getPlanLimits('solo')?.limite_textos_seo || PLANS.solo.limits.textoSeoBlog} 
                      />
                      <PlanLimitItem 
                        icon={Database} 
                        title="Meta Dados" 
                        limit={getPlanLimits('solo')?.limite_metadados || PLANS.solo.limits.metaDados} 
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <h4 className="font-semibold mb-4">O que você recebe:</h4>
            <ul className="space-y-3 flex-grow">
              {PLANS.solo.features.map((feature, index) => (
                <PlanFeature key={index} text={feature} />
              ))}
            </ul>
          </div>

          {/* Discovery Plan - highlighted */}
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white px-4 py-1 rounded-full text-sm font-medium">
              Mais Popular
            </div>
            
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
            
            {/* Limites do plano */}
            <Card className="mb-6 bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Limites mensais:</h4>
                <div className="space-y-2">
                  {dbPlans.length > 0 && (
                    <>
                      <PlanLimitItem 
                        icon={Users} 
                        title="Mercado e Público" 
                        limit={getPlanLimits('discovery')?.limite_mercado_publico || PLANS.discovery.limits.mercadoPublicoAlvo} 
                      />
                      <PlanLimitItem 
                        icon={Search} 
                        title="Palavras-chave" 
                        limit={getPlanLimits('discovery')?.limite_palavras_chave || PLANS.discovery.limits.palavrasChaves}
                        isHighlighted 
                      />
                      <PlanLimitItem 
                        icon={BarChart} 
                        title="Funil de Busca" 
                        limit={getPlanLimits('discovery')?.limite_funil_busca || PLANS.discovery.limits.funilBusca} 
                      />
                      <PlanLimitItem 
                        icon={FileText} 
                        title="Textos SEO" 
                        limit={getPlanLimits('discovery')?.limite_textos_seo || PLANS.discovery.limits.textoSeoBlog} 
                      />
                      <PlanLimitItem 
                        icon={Database} 
                        title="Meta Dados" 
                        limit={getPlanLimits('discovery')?.limite_metadados || PLANS.discovery.limits.metaDados} 
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <h4 className="font-semibold mb-4">O que você recebe:</h4>
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
            
            {/* Limites do plano */}
            <Card className="mb-6 bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Limites mensais:</h4>
                <div className="space-y-2">
                  <PlanLimitItem 
                    icon={Award} 
                    title="Todos os recursos" 
                    limit={null}
                    isHighlighted 
                  />
                  <p className="text-gray-600 text-sm mt-2">
                    Acesso ilimitado a todas as funcionalidades sem restrições.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <h4 className="font-semibold mb-4">O que você recebe:</h4>
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
