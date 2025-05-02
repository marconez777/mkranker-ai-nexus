
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Users, Search, FileText, Database, BarChart, Award, Bookmark, Video, Users2 } from "lucide-react";
import Footer from "@/components/home/Footer";
import { PLANS, PlanType } from "@/types/plans";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const message = location.state?.message || "Renove seu plano para acessar a plataforma.";
  const preSelectedPlan = location.state?.selectedPlan;
  
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>(preSelectedPlan || "discovery");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set pre-selected plan from navigation state if available
    if (preSelectedPlan) {
      setSelectedPlanType(preSelectedPlan);
    }
  }, [preSelectedPlan]);

  const generateCheckoutLink = async (planType: PlanType) => {
    if (isGeneratingLink) return;
    
    try {
      setIsGeneratingLink(true);
      toast.info("Gerando link de pagamento...");
      
      // Chamada para a Edge Function
      const { data, error } = await supabase.functions.invoke("create-checkout-link", {
        body: {
          user_id: user?.id || null,
          plano_id: planType,
          nome_plano: PLANS[planType].name
        }
      });
      
      if (error) {
        throw new Error(error.message || "Erro ao gerar link de pagamento");
      }
      
      if (!data.checkout_url) {
        throw new Error("Link de pagamento não gerado");
      }
      
      console.log("Link de pagamento gerado:", data.checkout_url);
      
      // Redirecionar para o checkout do Mercado Pago
      window.location.href = data.checkout_url;
      
    } catch (error: any) {
      console.error("Erro ao gerar link de pagamento:", error);
      toast.error(`Erro ao gerar link: ${error.message || "Tente novamente mais tarde"}`);
      setIsGeneratingLink(false);
    }
  };

  interface PlanFeatureProps {
    icon: React.ElementType;
    text: string;
  }
  
  const PlanFeatureItem = ({ icon: Icon, text }: PlanFeatureProps) => (
    <li className="flex gap-2 items-center mb-2">
      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </li>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-700">Assinatura Necessária</CardTitle>
              </div>
              <CardDescription className="text-red-600 text-lg">
                {message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Para acessar todas as funcionalidades da plataforma MKRanker, é necessário ter uma assinatura ativa.
              </p>
              <p className="text-gray-700 mb-4">
                Escolha um dos nossos planos abaixo e comece a aproveitar todos os recursos da plataforma.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full"
                onClick={() => navigate("/")}
              >
                Voltar para Home
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Voltar para Login
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Solo Plan */}
            <Card 
              className={`hover:shadow-md transition-all ${selectedPlanType === 'solo' ? 'border-primary shadow-md' : ''}`}
              onClick={() => setSelectedPlanType('solo')}
            >
              <CardHeader className="pb-2">
                <CardTitle>{PLANS.solo.name}</CardTitle>
                <CardDescription className="text-xl font-bold">R$ {PLANS.solo.price}/mês</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <ul className="space-y-1">
                  <PlanFeatureItem icon={Users} text="5 Pesquisas de Mercado" />
                  <PlanFeatureItem icon={BarChart} text="5 Funis de Busca" />
                  <PlanFeatureItem icon={Search} text="20 Pesquisas de Palavras Chave" />
                  <PlanFeatureItem icon={FileText} text="15 Textos Otimizados SEO" />
                  <PlanFeatureItem icon={Bookmark} text="5 Pesquisas de Pautas" />
                  <PlanFeatureItem icon={Database} text="50 Gerações de Meta Dados" />
                  <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
                  <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
                  <PlanFeatureItem icon={Users2} text="Mentoria em grupo (1 por mês)" />
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90"
                  disabled={isGeneratingLink}
                  onClick={() => generateCheckoutLink('solo')}
                >
                  {isGeneratingLink && selectedPlanType === 'solo' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Assinar Plano'
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Discovery Plan - highlighted */}
            <Card 
              className={`hover:shadow-md transition-all relative border-2 ${selectedPlanType === 'discovery' ? 'border-primary shadow-md' : 'border-mkranker-purple'}`}
              onClick={() => setSelectedPlanType('discovery')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white px-3 py-1 rounded-full text-xs font-medium">
                Mais Popular
              </div>
              <CardHeader className="pb-2 pt-6">
                <CardTitle>{PLANS.discovery.name}</CardTitle>
                <CardDescription className="text-xl font-bold">R$ {PLANS.discovery.price}/mês</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <ul className="space-y-1">
                  <PlanFeatureItem icon={Users} text="15 Pesquisas de Mercado" />
                  <PlanFeatureItem icon={BarChart} text="15 Funis de Busca" />
                  <PlanFeatureItem icon={Search} text="60 Pesquisas de Palavras Chave" />
                  <PlanFeatureItem icon={FileText} text="60 Textos Otimizados SEO" />
                  <PlanFeatureItem icon={Bookmark} text="15 Pesquisas de Pautas" />
                  <PlanFeatureItem icon={Database} text="100 Gerações de Meta Dados" />
                  <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
                  <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
                  <PlanFeatureItem icon={Users2} text="Mentoria Individual (1 por mês)" />
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90"
                  disabled={isGeneratingLink}
                  onClick={() => generateCheckoutLink('discovery')}
                >
                  {isGeneratingLink && selectedPlanType === 'discovery' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Assinar Plano'
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Escala Plan */}
            <Card 
              className={`hover:shadow-md transition-all ${selectedPlanType === 'escala' ? 'border-primary shadow-md' : ''}`}
              onClick={() => setSelectedPlanType('escala')}
            >
              <CardHeader className="pb-2">
                <CardTitle>{PLANS.escala.name}</CardTitle>
                <CardDescription className="text-xl font-bold">R$ {PLANS.escala.price}/mês</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold">Ferramentas ilimitadas:</span>
                  </li>
                  <PlanFeatureItem icon={Users} text="Pesquisas de Mercado Ilimitadas" />
                  <PlanFeatureItem icon={BarChart} text="Funis de Busca Ilimitados" />
                  <PlanFeatureItem icon={Search} text="Palavras Chave Ilimitadas" />
                  <PlanFeatureItem icon={FileText} text="Textos Otimizados SEO Ilimitados" />
                  <PlanFeatureItem icon={Bookmark} text="Pesquisas de Pautas Ilimitadas" />
                  <PlanFeatureItem icon={Database} text="Gerações de Meta Dados Ilimitadas" />
                  <PlanFeatureItem icon={Video} text="Treinamentos Gravados" />
                  <PlanFeatureItem icon={Video} text="Aulas Ao Vivo" />
                  <PlanFeatureItem icon={Users2} text="Mentoria Individual (2 por mês)" />
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90"
                  disabled={isGeneratingLink}
                  onClick={() => generateCheckoutLink('escala')}
                >
                  {isGeneratingLink && selectedPlanType === 'escala' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Assinar Plano'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
