import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Target, KeySquare, FileCheck, ShoppingBag, BookOpen, Tags, Check } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          MKRanker
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/register")} className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white">
            Registrar
          </Button>
        </div>
      </nav>
    </header>

    <section className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent leading-tight">Potencialize seu SEO com Inteligência Artificial</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">MKRanker conecta seu negócio com as mais avançadas tecnologias de IA (Gemini e Chat GPT) para gerar análises de mercado, conteúdo otimizado e estratégias de SEO que realmente funcionam.</p>
        <div className="flex justify-center gap-6">
          <Button size="lg" className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white px-8 text-lg h-14" onClick={() => navigate("/register")}>
            Começar Agora
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="border-2 border-mkranker-purple text-mkranker-purple hover:bg-mkranker-purple hover:text-white px-8 text-lg h-14">
            Ver Demo
          </Button>
        </div>
      </div>
    </section>

    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Tudo que você precisa para automatizar o seu SEO
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <Target className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Mercado e Público Alvo</h3>
            <p className="text-gray-600">Entenda seu mercado e público-alvo com análises detalhadas geradas por IA.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <Search className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Mapeamento do Funil</h3>
            <p className="text-gray-600">Receba uma lista de palavras do topo, meio e fundo de funil do seu nicho.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <KeySquare className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Palavras Chaves</h3>
            <p className="text-gray-600">Receba uma lista com as palavras-chave relacionadas e com a semântica correta.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Texto SEO para LP</h3>
            <p className="text-gray-600">Gere textos otimizados para suas páginas de vendas com foco em conversão.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Texto SEO para E-commerce</h3>
            <p className="text-gray-600">Gere textos otimizados para produtos e categorias da sua loja.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <FileCheck className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Texto SEO para Blog</h3>
            <p className="text-gray-600">Gere textos humanizados de altíssimo valor, otimizados para palavras chaves.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <Tags className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Meta Dados</h3>
            <p className="text-gray-600">Gere títulos e descrições persuasivas para todas as páginas do seu site.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-mkranker-purple to-mkranker-blue rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Pautas para Blog</h3>
            <p className="text-gray-600">Gere uma grade de pautas com os termos topo de funil de forma estratégica.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Integração com IA Avançada
        </h2>
        <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
          MKRanker utiliza o poder do GPT e Gemini para fornecer análises e conteúdos de altíssima qualidade.
        </p>
        
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

    <section className="py-24 bg-gradient-to-r from-mkranker-purple to-mkranker-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Pronto para transformar seu marketing?</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
          Junte-se a milhares de empresas que já estão usando MKRanker para otimizar suas estratégias de marketing.
        </p>
        <Button size="lg" className="bg-white text-mkranker-purple hover:bg-opacity-90 px-8 text-lg h-14" onClick={() => navigate("/register")}>
          Fazer SEO com I.A.
        </Button>
      </div>
    </section>

    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          Escolha o Plano Ideal para Você
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Solo</h3>
            <p className="text-gray-600 mb-6">Tudo o que freelancers ou empreendedores precisam para automatizar a rotina.</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ 149<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                5 Análises de Mercado
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                5 Mapeamentos de Funis
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                15 Textos SEO Otimizados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                15 Meta Dados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                20 Pautas para Blog
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col transform scale-105">
            <h3 className="text-2xl font-bold mb-4">Discovery</h3>
            <p className="text-gray-600 mb-6">Perfeito para Empresas ou Agencias que querem escalar o SEO de forma mais agressiva.</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ 399<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                15 Análises de Mercado
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                15 Mapeamentos de Funis
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                30 Textos SEO Otimizados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                30 Meta Dados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                100 Pautas para Blog
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                Treinamentos e Aulas Ao Vivo
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Escala</h3>
            <p className="text-gray-600 mb-6">Para você quer realmente dominar o mercado e tomar distancia dos seus concorrentes</p>
            <div className="text-4xl font-bold mb-2 flex items-end">
              R$ 1299<span className="text-lg text-gray-500 ml-1">/mês</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white w-full mb-8"
              onClick={() => navigate("/register")}
            >
              Começar o SEO com I.A.
            </Button>
            <h4 className="font-semibold mb-4">O que você pode fazer:</h4>
            <ul className="space-y-3 flex-grow">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                15 Análises de Mercado
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                15 Mapeamentos de Funis
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                30 Textos SEO Otimizados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                30 Meta Dados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                100 Pautas para Blog
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                Treinamentos e Aulas Ao Vivo
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mkranker-purple to-mkranker-blue flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                1 Encontro 1 a 1 com Marco Guimarães /mês
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
              MKRanker
            </div>
            <p className="text-gray-400">Marketing inteligente com IA</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Produto</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors"><a href="#">Recursos</a></li>
              <li className="hover:text-white transition-colors"><a href="#">Preços</a></li>
              <li className="hover:text-white transition-colors"><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors"><a href="#">Sobre</a></li>
              <li className="hover:text-white transition-colors"><a href="#">Contato</a></li>
              <li className="hover:text-white transition-colors"><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors"><a href="#">Termos</a></li>
              <li className="hover:text-white transition-colors"><a href="#">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MKRanker. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </div>;
};

export default HomePage;
