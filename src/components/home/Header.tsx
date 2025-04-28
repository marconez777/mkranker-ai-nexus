
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DocsButton from "./DocsButton";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
          MKRanker
        </div>
        <div className="flex gap-4 items-center">
          <DocsButton />
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button 
            onClick={() => navigate("/register")} 
            className="bg-gradient-to-r from-mkranker-purple to-mkranker-blue hover:opacity-90 text-white"
          >
            Registrar
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
