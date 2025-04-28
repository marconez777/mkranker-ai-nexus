
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="w-full">
      <AuroraBackground>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent leading-tight">
                Potencialize seu SEO com Inteligência Artificial
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                MKRanker conecta seu negócio com as mais avançadas tecnologias de IA (Gemini e Chat GPT) para gerar análises de mercado, conteúdo otimizado e estratégias de SEO que realmente funcionam.
              </p>
              <div className="flex justify-center gap-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white px-8 text-lg h-14"
                  onClick={() => navigate("/register")}
                >
                  Começar Agora
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="border-2 border-mkranker-purple text-mkranker-purple hover:bg-mkranker-purple hover:text-white px-8 text-lg h-14"
                >
                  Ver Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
};

export default HeroSection;
