
import { motion } from "framer-motion";

const ScreenshotsSection = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/c94aa744-f4e0-4892-acac-b6b2c6caceb2.png",
      alt: "Texto SEO para LP - Interface da ferramenta",
      title: "Texto SEO para LP"
    },
    {
      src: "/lovable-uploads/89b2eb53-1a3c-4350-9da1-caac39b041cb.png",
      alt: "Funil de Busca - Interface da ferramenta",
      title: "Funil de Busca"
    },
    {
      src: "/lovable-uploads/38ca51b2-0801-4dc1-83ea-265925bcefef.png",
      alt: "Mercado e Público Alvo - Interface da ferramenta",
      title: "Mercado e Público Alvo"
    },
    {
      src: "/lovable-uploads/ac052ae2-97ca-44d5-8966-6134f33abf0b.png",
      alt: "Menu de Funcionalidades - MKRanker",
      title: "Ferramentas Disponíveis"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Conheça nossa plataforma
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.5,
                ease: "easeInOut"
              }}
              className="rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={screenshot.src} 
                  alt={screenshot.alt} 
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold">{screenshot.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
