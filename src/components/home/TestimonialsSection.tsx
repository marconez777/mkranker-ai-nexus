import { motion } from "framer-motion";
import { YoutubeIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
const TestimonialsSection = () => {
  const testimonials = [{
    title: "100k de Tráfego em 6 meses",
    name: "Dr. Gabriel Psiquiatra",
    videoUrl: "https://youtu.be/OWWQfH-V1Iw?si=tW4hC3y1JLa2Hkoi",
    thumbnailUrl: "/lovable-uploads/e761a19e-efff-4a7c-be4f-3f62409423f9.png",
    videoId: "OWWQfH-V1Iw"
  }, {
    title: "110k de Tráfego em 3 meses",
    name: "Dr. Diego Gastro",
    videoUrl: "https://www.youtube.com/watch?v=eRZUTQthZGI",
    thumbnailUrl: "/lovable-uploads/e761a19e-efff-4a7c-be4f-3f62409423f9.png",
    videoId: "eRZUTQthZGI"
  }];
  return <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 relative">
          {/* Smoky/blurry purple text effect */}
          <span className="relative z-10 bg-gradient-to-r from-mkranker-purple via-purple-500 to-mkranker-blue bg-clip-text text-transparent">Resultados Incríveis! </span>
          <span className="absolute inset-0 blur-sm bg-gradient-to-r from-mkranker-purple via-purple-400 to-mkranker-blue opacity-40 bg-clip-text text-transparent z-0">
            Temos clientes de consultoria que já estão colhendo resultados expressivos
          </span>
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          graças ao mesmo método em que a MK Ranker foi treinada
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.2,
          duration: 0.5,
          ease: "easeInOut"
        }} className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 text-center underline decoration-mkranker-purple decoration-2 mb-1">
                  {testimonial.title}
                </h3>
                <p className="text-lg text-gray-600 text-center mb-4">
                  {testimonial.name}
                </p>
              </div>
              
              <div className="relative cursor-pointer group">
                {/* Video embed with aspect ratio */}
                <AspectRatio ratio={16 / 9}>
                  <iframe src={`https://www.youtube.com/embed/${testimonial.videoId}`} title={testimonial.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                </AspectRatio>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                    <YoutubeIcon className="h-12 w-12 text-red-600" />
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;