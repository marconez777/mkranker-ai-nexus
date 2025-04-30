
const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
            MKRanker
          </div>
          <p className="text-gray-400">Uma empresa do MK Art</p>
          <a 
            href="https://mkart.com.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors inline-block"
          >
            mkart.com.br
          </a>
          <p className="text-gray-400">Mk Art Trafego Organico Ltda</p>
          <p className="text-gray-400">CNPJ: 26.248.684/0001-39</p>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MKRanker. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
