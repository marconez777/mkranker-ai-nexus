import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Target, KeySquare, FileCheck, ShoppingBag, BookOpen, Tags } from "lucide-react";
const HomePage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-mkranker-purple">MKRanker</div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Registrar</Button>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Potencialize seu Marketing com Inteligência Artificial
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          MKRanker conecta seu negócio com as mais avançadas tecnologias de IA para gerar análises de mercado, conteúdo otimizado e estratégias de SEO que realmente funcionam.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-mkranker-purple hover:bg-opacity-90 text-white px-8" onClick={() => navigate("/register")}>
            Começar Agora
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
            Ver Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Tudo que você precisa para automatizar o seu SEO</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mercado e Público Alvo</h3>
              <p className="text-gray-600">Entenda seu mercado e público-alvo com análises detalhadas geradas por IA.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mapeamento do Funil</h3>
              <p className="text-gray-600">Receba uma lista de palavras do topo, meio e fundo de funil do seu nicho.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <KeySquare className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Palavras Chaves</h3>
              <p className="text-gray-600">Receba uma lista com as palavras-chave relacionadas e com a semântica correta.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Texto SEO para LP</h3>
              <p className="text-gray-600">Gere textos otimizados para suas páginas de vendas com foco em conversão.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Texto SEO para E-commerce</h3>
              <p className="text-gray-600">Gere textos otimizados para produtos e categorias da sua loja.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Texto SEO para Blog</h3>
              <p className="text-gray-600">Gere textos humanizados de altíssimo valor, otimizados para palavras chaves.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Tags className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meta Dados</h3>
              <p className="text-gray-600">Gere títulos e descrições persuasivas para todas as páginas do seu site.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-mkranker-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pautas para Blog</h3>
              <p className="text-gray-600">Gere uma grade de pautas com os termos topo de funil de forma estratégica.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Integração com IA Avançada</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            MKRanker utiliza o poder do GPT e Gemini através do n8n para fornecer análises e conteúdos de altíssima qualidade.
          </p>
          
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-white p-6 rounded-lg shadow-sm w-64">
              <div className="mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" alt="ChatGPT" className="h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold">ChatGPT</h3>
              <p className="text-gray-600 text-sm">Geração de conteúdo natural e humano para suas necessidades.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm w-64">
              <div className="mb-4">
                <img alt="Gemini" className="h-16 mx-auto" src="/lovable-uploads/b30c0a9a-27b7-4697-9d43-96781af558ba.png" />
              </div>
              <h3 className="text-lg font-semibold">Gemini</h3>
              <p className="text-gray-600 text-sm">Análises avançadas multimodais para insights mais profundos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm w-64">
              <div className="mb-4">
                <img src="https://n8n.io/images/n8n-logo.svg" alt="n8n" className="h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold">n8n</h3>
              <p className="text-gray-600 text-sm">Automatização de fluxos de trabalho para integração perfeita.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-mkranker-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar seu marketing?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Junte-se a milhares de empresas que já estão usando MKRanker para otimizar suas estratégias de marketing.
          </p>
          <Button size="lg" className="bg-white text-mkranker-purple hover:bg-gray-100" onClick={() => navigate("/register")}>Fazer 
SEO com I.A.</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">MKRanker</div>
              <p className="text-gray-400">Marketing inteligente com IA</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-2">Produto</h3>
                <ul className="text-gray-400">
                  <li className="mb-1">Recursos</li>
                  <li className="mb-1">Preços</li>
                  <li className="mb-1">FAQ</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Empresa</h3>
                <ul className="text-gray-400">
                  <li className="mb-1">Sobre</li>
                  <li className="mb-1">Contato</li>
                  <li className="mb-1">Blog</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Legal</h3>
                <ul className="text-gray-400">
                  <li className="mb-1">Termos</li>
                  <li className="mb-1">Privacidade</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MKRanker. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default HomePage;