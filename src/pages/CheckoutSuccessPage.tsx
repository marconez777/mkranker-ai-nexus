
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import Footer from "@/components/home/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshPlan } = usePlan();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingComplete, setProcessingComplete] = useState(false);
  
  const planoId = searchParams.get('plano') || 'discovery';
  const userId = searchParams.get('user_id') || user?.id;

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (!userId) {
          toast.error("Não foi possível identificar o usuário.");
          setIsProcessing(false);
          return;
        }

        // Determinar o plano baseado no parâmetro
        let planType = 'discovery';
        if (planoId === 'solo' || planoId === 'escala') {
          planType = planoId;
        }
        
        console.log("Processando pagamento para:", { userId, planType });

        // Buscar o ID do plano do banco de dados
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('id')
          .eq('name', planType)
          .maybeSingle();

        if (plansError) {
          console.error("Erro ao buscar plano:", plansError);
          throw new Error("Erro ao processar o pagamento: Plano não encontrado");
        }

        const planId = plansData?.id;
        
        if (!planId) {
          // Se não encontrou o plano no banco, usar o plano default
          console.log("Plano não encontrado no banco, usando o tipo direto:", planType);
          
          // Atualizar o perfil do usuário com o tipo de plano
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ plan_type: planType })
            .eq('id', userId);
            
          if (profileError) {
            console.error("Erro ao atualizar perfil:", profileError);
            throw new Error("Erro ao atualizar suas informações de plano");
          }
        } else {
          console.log("Plano encontrado no banco, ID:", planId);
          
          // Calcular data de vencimento (30 dias a partir de agora)
          const vencimento = new Date();
          vencimento.setDate(vencimento.getDate() + 30);
          
          // Verificar se já existe uma assinatura para este usuário
          const { data: existingSubscription } = await supabase
            .from('user_subscription')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
            
          if (existingSubscription) {
            // Atualizar a assinatura existente
            const { error: updateError } = await supabase
              .from('user_subscription')
              .update({
                plan_id: planId,
                status: 'ativo',
                vencimento: vencimento.toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);
              
            if (updateError) {
              console.error("Erro ao atualizar assinatura:", updateError);
              throw new Error("Erro ao atualizar sua assinatura");
            }
          } else {
            // Inserir nova assinatura
            const { error: insertError } = await supabase
              .from('user_subscription')
              .insert({
                user_id: userId,
                plan_id: planId,
                status: 'ativo',
                vencimento: vencimento.toISOString()
              });
              
            if (insertError) {
              console.error("Erro ao inserir assinatura:", insertError);
              throw new Error("Erro ao criar sua assinatura");
            }
          }
          
          // Atualizar também o perfil do usuário
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ plan_type: planType })
            .eq('id', userId);
            
          if (profileError) {
            console.error("Erro ao atualizar perfil:", profileError);
          }
        }
        
        // Atualizar o contexto de plano
        await refreshPlan();
        
        setProcessingComplete(true);
        toast.success("Assinatura ativada com sucesso!");
      } catch (error: any) {
        console.error("Erro ao processar pagamento:", error);
        toast.error(error.message || "Erro ao processar o pagamento");
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [userId, planoId, refreshPlan]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">Pagamento Processado!</CardTitle>
              </div>
              <CardDescription className="text-green-700 text-lg">
                Estamos finalizando a ativação da sua assinatura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-gray-700">Processando o seu pagamento...</p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-gray-700 mb-4">
                    {processingComplete 
                      ? "Sua assinatura foi ativada com sucesso! Agora você tem acesso completo à plataforma."
                      : "Ocorreu um problema ao processar sua assinatura. Por favor, entre em contato com o suporte."}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full"
                onClick={() => navigate("/dashboard")}
                disabled={isProcessing}
              >
                Ir para o Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/")}
                disabled={isProcessing}
              >
                Voltar para Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutSuccessPage;
