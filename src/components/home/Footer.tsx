
const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-16">
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
  );
};

export default Footer;
