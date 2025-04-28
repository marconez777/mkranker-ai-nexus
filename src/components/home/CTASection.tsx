
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Pronto para transformar seu marketing?</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
          Junte-se a milhares de empresas que já estão usando MKRanker para otimizar suas estratégias de marketing.
        </p>
        <Button 
          size="lg" 
          className="bg-white text-mkranker-purple hover:bg-opacity-90 px-8 text-lg h-14"
          onClick={() => navigate("/register")}
        >
          Fazer SEO com I.A.
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
