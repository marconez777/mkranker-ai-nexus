
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  retryCount: number;
  isLoading: boolean;
}

export const ErrorDisplay = ({
  message,
  onRetry,
  retryCount,
  isLoading
}: ErrorDisplayProps) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro de conexão</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry} 
          className="mt-2"
          disabled={isLoading || retryCount >= 3}
        >
          {isLoading ? "Tentando..." : "Tentar novamente"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

