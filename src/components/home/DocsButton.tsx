
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const DocsButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline"
      className="flex items-center gap-2 border-mkranker-purple text-mkranker-purple hover:bg-mkranker-purple/10"
      onClick={() => navigate("/docs")}
    >
      <FileText className="h-4 w-4" />
      Documentação
    </Button>
  );
};

export default DocsButton;
