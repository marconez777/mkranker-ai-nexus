
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Pronto para transformar seu marketing?"
            subtitle="Junte-se a milhares de empresas que já estão usando MKRanker para otimizar suas estratégias de marketing."
            variant="default"
          />
          
          <Button 
            size="lg" 
            className="bg-white text-mkranker-purple hover:bg-opacity-90 px-8 text-lg h-14"
            onClick={() => navigate("/register")}
          >
            Fazer SEO com I.A.
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
