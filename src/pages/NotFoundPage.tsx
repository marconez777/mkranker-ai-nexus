
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-6xl font-bold text-mkranker-purple">404</h1>
      <p className="text-2xl text-gray-600 mb-6">Página não encontrada</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button onClick={() => navigate("/")}>Voltar para a Home</Button>
    </div>
  );
};

export default NotFoundPage;
