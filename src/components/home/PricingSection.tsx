
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PricingSectionHeader from "./pricing/PricingSectionHeader";
import PlansGrid from "./pricing/PlansGrid";
import SectionHeader from "./SectionHeader";

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

const PricingSection = () => {
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

  return (
    <section id="planos" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Escolha o Plano Ideal para Você"
          subtitle="Escale seu marketing digital com nossos planos completos. Todos incluem acesso às melhores ferramentas de SEO com IA."
          variant="gradient"
        />
        
        <PlansGrid />
      </div>
    </section>
  );
};

export default PricingSection;
