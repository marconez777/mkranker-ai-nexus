
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Users, Search, FileText, Database, BarChart, Award, Bookmark, Video, Users2 } from "lucide-react";
import { Plan } from "@/types/plans";

interface PlanFeatureProps {
  icon: React.ElementType;
  text: string;
  isHighlighted?: boolean;
}

export const PlanFeatureItem = ({ icon: Icon, text, isHighlighted = false }: PlanFeatureProps) => (
  <li className={`flex items-center gap-2 ${isHighlighted ? 'text-mkranker-purple font-medium' : 'text-gray-600'} mb-2`}>
    <Icon size={16} className={isHighlighted ? 'text-mkranker-purple' : 'text-gray-500'} />
    <span>{text}</span>
  </li>
);

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isPopular = false }) => {
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    navigate("/checkout", { state: { selectedPlan: plan.type } });
  };

  return (
    <div 
      className={`bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 
        ${isPopular ? 'border-2 border-mkranker-purple transform scale-105 relative' : 'border border-gray-100'} 
        flex flex-col`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white px-4 py-1 rounded-full text-sm font-medium">
          Mais Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <p className="text-gray-600 mb-4">{plan.description}</p>
      <div className="text-3xl font-bold mb-4 flex items-end">
        R$ {plan.price}<span className="text-lg text-gray-500 ml-1">/mês</span>
      </div>
      <Button 
        className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-6"
        onClick={handleSelectPlan}
      >
        Começar Agora
      </Button>
      
      <ul className="space-y-1 mt-2 flex-grow">
        {plan.type === 'escala' && (
          <li className="flex items-center gap-2 text-mkranker-purple font-medium mb-4">
            <Award size={18} className="text-mkranker-purple" />
            <span className="font-semibold">Todas as ferramentas ilimitadas:</span>
          </li>
        )}
        
        {renderPlanFeatures(plan)}
      </ul>
    </div>
  );
};

const renderPlanFeatures = (plan: Plan) => {
  // Função auxiliar para renderizar as features específicas do plano
  switch(plan.type) {
    case 'solo':
      return (
        <>
          <PlanFeatureItem icon={Users} text="5 Pesquisas de Mercado" />
          <PlanFeatureItem icon={BarChart} text="5 Funis de Busca" />
          <PlanFeatureItem icon={Search} text="20 Pesquisas de Palavras Chave" isHighlighted />
          <PlanFeatureItem icon={FileText} text="15 Textos Otimizados SEO" />
          <PlanFeatureItem icon={Bookmark} text="5 Pesquisas de Pautas" />
          <PlanFeatureItem icon={Database} text="50 Gerações de Meta Dados" isHighlighted />
          <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
          <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
          <PlanFeatureItem icon={Users2} text="Mentoria em grupo (1 por mês)" />
        </>
      );
    case 'discovery':
      return (
        <>
          <PlanFeatureItem icon={Users} text="15 Pesquisas de Mercado" />
          <PlanFeatureItem icon={BarChart} text="15 Funis de Busca" />
          <PlanFeatureItem icon={Search} text="60 Pesquisas de Palavras Chave" isHighlighted />
          <PlanFeatureItem icon={FileText} text="60 Textos Otimizados SEO" isHighlighted />
          <PlanFeatureItem icon={Bookmark} text="15 Pesquisas de Pautas" />
          <PlanFeatureItem icon={Database} text="100 Gerações de Meta Dados" isHighlighted />
          <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
          <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
          <PlanFeatureItem icon={Users2} text="Mentoria Individual (1 por mês)" isHighlighted />
        </>
      );
    case 'escala':
      return (
        <>
          <PlanFeatureItem icon={Users} text="Pesquisas de Mercado Ilimitadas" />
          <PlanFeatureItem icon={BarChart} text="Funis de Busca Ilimitados" />
          <PlanFeatureItem icon={Search} text="Palavras Chave Ilimitadas" isHighlighted />
          <PlanFeatureItem icon={FileText} text="Textos Otimizados SEO Ilimitados" isHighlighted />
          <PlanFeatureItem icon={Bookmark} text="Pesquisas de Pautas Ilimitadas" />
          <PlanFeatureItem icon={Database} text="Gerações de Meta Dados Ilimitadas" isHighlighted />
          <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
          <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
          <PlanFeatureItem icon={Users2} text="Mentoria Individual (2 por mês)" isHighlighted />
        </>
      );
    default:
      return null;
  }
};

export default PlanCard;
