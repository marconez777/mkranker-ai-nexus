
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Footer from "@/components/home/Footer";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "Renove seu plano para acessar a plataforma.";

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
