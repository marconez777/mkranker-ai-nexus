
import { useSubscriptionAlert } from "@/hooks/useSubscriptionAlert";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell } from "lucide-react";

export const SubscriptionAlertBanner = () => {
  const { daysRemaining, showAlert, handleRenewClick } = useSubscriptionAlert();
  
  if (!showAlert) return null;
  
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <Bell className="h-4 w-4 text-amber-500" />
      <AlertDescription className="flex items-center justify-between text-amber-800">
        <span>Sua assinatura vence em <strong>{daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}</strong>.</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRenewClick}
          className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
        >
          Renovar agora
        </Button>
      </AlertDescription>
    </Alert>
  );
};
