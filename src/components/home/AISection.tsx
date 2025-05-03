
import SectionHeader from "./SectionHeader";

const AISection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Integração com IA Avançada"
          subtitle="MKRanker utiliza o poder do GPT e Gemini para fornecer análises e conteúdos de altíssima qualidade."
          variant="gradient"
        />
        
        <div className="flex justify-center gap-8">
          <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-72 border border-gray-100">
            <div className="mb-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" alt="ChatGPT" className="h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-3">ChatGPT</h3>
            <p className="text-gray-600 text-sm">Geração de conteúdo natural e humano para suas necessidades.</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-72 border border-gray-100">
            <div className="mb-6">
              <img alt="Gemini" className="h-16 mx-auto object-contain" src="/lovable-uploads/b30c0a9a-27b7-4697-9d43-96781af558ba.png" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Gemini</h3>
            <p className="text-gray-600 text-sm">Análises avançadas multimodais para insights mais profundos.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
