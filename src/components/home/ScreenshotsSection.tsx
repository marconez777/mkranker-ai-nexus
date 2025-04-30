
import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, ExternalLink } from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const ScreenshotsSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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
    }
    // Removed the fourth screenshot item
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 relative">
          {/* Smoky/blurry purple text effect */}
          <span className="relative z-10 bg-gradient-to-r from-mkranker-purple via-purple-500 to-mkranker-blue bg-clip-text text-transparent">
            Conheça nossa plataforma
          </span>
          <span className="absolute inset-0 blur-sm bg-gradient-to-r from-mkranker-purple via-purple-400 to-mkranker-blue opacity-40 bg-clip-text text-transparent z-0">
            Conheça nossa plataforma
          </span>
        </h2>
        
        <div className="flex flex-col gap-12 max-w-3xl mx-auto">
          {screenshots.map((screenshot, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                  className="group cursor-pointer"
                >
                  {/* Mac-style frame container */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-b from-gray-100 to-gray-200 p-1">
                    {/* Mac-style top bar */}
                    <div className="bg-gray-200 rounded-t-lg px-4 py-2 flex items-center border-b border-gray-300">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 text-center text-xs text-gray-500 font-medium">
                        mkranker.com
                      </div>
                      <Monitor className="text-gray-400 h-4 w-4" />
                    </div>
                    
                    {/* Screenshot container with shadow effect */}
                    <div className="relative bg-white p-1 rounded-b-lg">
                      <div className="overflow-hidden">
                        <img 
                          src={screenshot.src} 
                          alt={screenshot.alt} 
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Title overlay with smoky/blurry purple effect */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-between items-center">
                        <div className="relative">
                          <h3 className="text-white text-xl font-semibold">{screenshot.title}</h3>
                          {/* Smoky blur effect under the text */}
                          <div className="absolute bottom-0 left-0 w-full h-full blur-sm bg-purple-500/30 -z-10"></div>
                        </div>
                        <ExternalLink className="text-white h-5 w-5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] p-1 overflow-hidden bg-white">
                <img 
                  src={screenshot.src} 
                  alt={screenshot.alt} 
                  className="w-full h-auto object-contain"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
