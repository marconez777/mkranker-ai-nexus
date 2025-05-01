
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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
  
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>("discovery");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
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
                Ver Planos Disponíveis
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
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLANS).filter(([key]) => key !== 'free').map(([planType, plan]) => (
              <Card 
                key={planType} 
                className={`hover:shadow-md transition-all ${selectedPlanType === planType ? 'border-primary shadow-md' : ''}`}
                onClick={() => setSelectedPlanType(planType as PlanType)}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="text-xl font-bold">R$ {plan.price}/mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90"
                    disabled={isGeneratingLink}
                    onClick={() => generateCheckoutLink(planType as PlanType)}
                  >
                    {isGeneratingLink ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando link...
                      </>
                    ) : (
                      'Assinar Agora'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
